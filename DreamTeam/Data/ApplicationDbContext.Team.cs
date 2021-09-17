using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Areas.Api.User.ViewModels;
using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static DreamTeam.Areas.Api.User.TeamUserController;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task<IEnumerable<TeamSummaryViewModel>> GetTeams(Guid seasonId)
        {
            return Connection.QueryAsync<TeamSummaryViewModel>("SELECT T.Id, COALESCE(T.Updated, T.Created) AS Updated, T.Name, T.Owner, U.UserName, T.Valid, T.Balance, T.Paid " +
                "FROM Teams AS T " +
                "   LEFT OUTER JOIN AspNetUsers AS U ON T.UserId=U.Id " +
                "WHERE SeasonId=@seasonId ORDER BY T.Name, COALESCE(U.Name, U.UserName)", new { seasonId });
        }

        public Task<IEnumerable<TeamSummaryViewModel>> GetTeamsForUser(string userId)
        {
            return Connection.QueryAsync<TeamSummaryViewModel>("SELECT T.Id, COALESCE(T.Updated, T.Created) AS Updated, T.Name, T.Owner, T.Valid, T.Balance, T.Paid, P.Points, K.SeasonRank " +
                "FROM Teams AS T " +
                "    OUTER APPLY(SELECT SUM(TRR.Points) AS Points FROM Rounds AS R INNER JOIN TeamRoundResults AS TRR ON TRR.RoundId = R.Id WHERE R.Completed = 1 AND TRR.TeamId = T.Id) AS P " +
                "    OUTER APPLY(SELECT TOP(1) TRK.SeasonRank FROM Rounds AS R INNER JOIN TeamRoundRanks AS TRK ON TRK.RoundId = R.Id WHERE R.Completed = 1 AND TRK.TeamId = T.Id ORDER BY R.StartDate DESC) AS K " +
                "WHERE UserId = @userId " +
                "GROUP BY T.Id, T.Created, T.Updated, T.Name, T.Owner, T.Valid, T.Balance, T.Paid, P.Points, K.SeasonRank " +
                "ORDER BY T.Name", new { userId });
        }

        public async Task<UserTeamViewModel> GetUserTeam(string userId, Guid teamId, Guid? tradePeriodId)
        {
            var sql = "SELECT T.Id, COALESCE(T.Updated, T.Created) AS Updated, T.Name, T.Owner, T.Valid, T.Balance, T.Paid " +
                "FROM Teams AS T " +
                "WHERE T.Id = @teamId AND T.UserId = @userId; " +
                "SELECT UTP.PlayerId AS Id, P.Name, UTP.Cost, CAST(CASE WHEN UTP.TradePeriodId=@tradePeriodId THEN 1 ELSE 0 END as bit) AS Added, UTP.Removed, " +
                "	COALESCE((SELECT SUM(RP.Points) FROM Rounds AS R INNER JOIN RoundPlayers AS RP ON R.Id = RP.RoundId WHERE R.Completed = 1 AND RP.PlayerId = UTP.PlayerId), 0) AS Points, " +
                "   CASE WHEN C.IsCaptain=1 THEN 10 WHEN VC.IsVice=1 THEN 5 ELSE 0 END AS [Type] " +
                "FROM TeamPlayers AS UTP " +
                "   INNER JOIN Players AS P ON UTP.PlayerId = P.Id " +
                "   OUTER APPLY (SELECT TOP(1) 1 AS IsCaptain FROM TeamCaptains AS C WHERE C.TeamId=@teamId AND C.CaptainId=P.Id AND Removed=0 ORDER BY Created DESC) AS C " +
                "   OUTER APPLY (SELECT TOP(1) 1 AS IsVice FROM TeamCaptains AS VC WHERE VC.TeamId=@teamId AND VC.ViceCaptainId=P.Id AND Removed=0 ORDER BY Created DESC) AS VC " +
                "WHERE UTP.TeamId = @teamId AND (UTP.Removed=0 OR @tradePeriodId=UTP.TradePeriodId) " +
                "ORDER BY CASE WHEN C.IsCaptain=1 THEN 10 WHEN VC.IsVice=1 THEN 5 ELSE 0 END DESC, P.Name";

            using (var rdr = await Connection.QueryMultipleAsync(sql, new { userId, teamId, tradePeriodId }))
            {
                var team = await rdr.ReadFirstOrDefaultAsync<UserTeamViewModel>();

                if (team == null)
                    return null;

                team.Players = (await rdr.ReadAsync<UserTeamPlayerViewModel>()).ToList();

                return team;
            }
        }

        public async Task RegisterTeams(RegisterTeamsModel model, string userId, string token = null)
        {
            var season = await GetSeasonAsync(model.SeasonId);

            if (token == null) token = Guid.NewGuid().ToString("N");

            foreach (var team in model.Teams)
            {
                var obj = new Team
                {
                    Id = Guid.NewGuid(),
                    Created = DateTime.UtcNow,
                    Name = team.Name,
                    Owner = team.Owner,
                    UserId = userId,
                    SeasonId = model.SeasonId,
                    Balance = season.Budget,
                    Paid = !string.IsNullOrEmpty(token),
                    RegistrationToken = token,
                    Valid = false
                };

                Teams.Add(obj);
            }

            await SaveChangesAsync();
        }

        public async Task UpdateTeamDetails(string userId, Guid teamId, RegisterTeamsModel.TeamViewModel model)
        {
            var team = Teams.Where(x => x.Id == teamId && x.UserId == userId).FirstOrDefault();

            if (team == null)
                return;

            team.Name = model.Name;
            team.Owner = model.Owner;
            team.Updated = DateTime.UtcNow;

            Teams.Update(team);

            await SaveChangesAsync();
        }

        public async Task UpdateTeamPlayers(Guid teamId, Guid? tradePeriodId, List<Guid> addedPlayers, List<Guid> removedPlayers, Guid captainId, Guid viceCaptainId)
        {
            using (var tran = await Connection.BeginTransactionAsync())
            {
                var now = DateTime.UtcNow;

                // Remove any (vice)captains assigned during this trade period or all if within registration
                await Connection.ExecuteAsync("DELETE FROM TeamCaptains WHERE TeamId=@teamId AND (@tradePeriodId Is Null OR (TradePeriodId=@tradePeriodId AND Removed=0))",
                    new { teamId, tradePeriodId }, tran);
                // Cancel the Remove flag from (vice)captains that were set within this trade period
                await Connection.ExecuteAsync("UPDATE TeamCaptains SET Removed=0, TradePeriodId=NULL, Updated=@now WHERE TeamId=@teamId AND Removed=1 AND TradePeriodId=@tradePeriodId",
                    new { teamId, tradePeriodId, now }, tran);
                // Remove any players assigned to the team that match the trade period or all players if there is no trade period (ie: during registration phase)
                await Connection.ExecuteAsync("DELETE FROM TeamPlayers WHERE TeamId=@teamId AND (@tradePeriodId Is Null OR (TradePeriodId=@tradePeriodId AND Removed=0))",
                    new { teamId, tradePeriodId }, tran);
                // Cancel the Removed flag from players that were set within this trade period
                await Connection.ExecuteAsync("UPDATE TeamPlayers SET Removed=0, TradePeriodId=NULL, Updated=@now WHERE TeamId=@teamId AND Removed=1 AND TradePeriodId=@tradePeriodId",
                    new { teamId, tradePeriodId, now }, tran);
                // Set the Removed flag on all players in the removedPlayers list
                await Connection.ExecuteAsync("UPDATE TeamPlayers SET Removed=1, TradePeriodId=@tradePeriodId, Updated=@now WHERE TeamId=@teamId AND PlayerId IN @removedPlayers",
                    new { teamId, tradePeriodId, removedPlayers, now }, tran);
                // Add all new players to the team for this trade period
                await Connection.ExecuteAsync("INSERT INTO TeamPlayers (Id, TeamId, PlayerId, Cost, TradePeriodId, Removed, Created) " +
                    "SELECT NEWID(), @teamId, P.Id, P.Cost, @tradePeriodId, 0, @now " +
                    "FROM Players AS P " +
                    "WHERE P.Id IN @addedPlayers",
                    new { teamId, tradePeriodId, addedPlayers, now }, tran);

                // Assign captains and vice captains
                await Connection.ExecuteAsync("INSERT INTO TeamCaptains (Id, Created, TeamId, TradePeriodId, CaptainId, ViceCaptainId, Removed) " +
                    "VALUES (NEWID(), @now, @teamId, @tradePeriodId, @captainId, @viceCaptainId, 0)",
                    new { now, teamId, tradePeriodId, captainId, viceCaptainId }, tran);

                // Set the balance for the team
                await Connection.ExecuteAsync("DECLARE @budget int; " +
                    "SELECT @budget=S.Budget FROM Seasons AS S INNER JOIN Teams AS T ON T.SeasonId=S.Id WHERE T.Id=@teamId; " +
                    "UPDATE Teams SET Valid=1, Updated=@now, " +
                    "   Balance=@budget - (SELECT SUM(Cost) FROM TeamPlayers WHERE TeamId=@teamId AND Removed=0) " +
                    "WHERE Id=@teamId",
                    new { teamId, now }, tran);

                await tran.CommitAsync();
            }
        }
    }
}
