﻿using Dapper;
using DreamTeam.Areas.Api;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        #region Rounds

        public Task<IEnumerable<RoundSummaryViewModel>> GetRounds(Guid seasonId)
        {
            return Connection.QueryAsync<RoundSummaryViewModel>("SELECT R.Id, R.Name, R.StartDate, R.EndDate, R.Status, COUNT(P.Id) AS Players " +
                "FROM Rounds AS R LEFT OUTER JOIN RoundPlayers AS P ON R.Id=P.RoundId " +
                "WHERE R.SeasonId=@seasonId " +
                "GROUP BY R.Id, R.Name, R.StartDate, R.EndDate, R.Status " +
                "ORDER BY R.Name", new { seasonId });
        }

        public Task<RoundViewModel> GetRound(Guid roundId)
        {
            return Connection.QueryFirstOrDefaultAsync<RoundViewModel>("SELECT Id, Name, Created, Updated, Status, StartDate, EndDate " +
                "FROM Rounds WHERE Id=@roundId", new { roundId });
        }

        public Task<RoundViewModel> GetRound(Guid seasonId, Guid roundId)
        {
            return Connection.QueryFirstOrDefaultAsync<RoundViewModel>("SELECT Id, Name, Created, Updated, Status, StartDate, EndDate " +
                "FROM Rounds WHERE SeasonId=@seasonId AND Id=@roundId", new { seasonId, roundId });
        }

        public Task<Guid> AddRound(Guid seasonId, RoundUpdateViewModel model)
        {
            var round = new Round
            {
                Id = Guid.NewGuid(),
                SeasonId = seasonId,
                Created = DateTime.UtcNow,
                Status = RoundStateType.Creating,
                Name = model.Name,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            };

            Rounds.Add(round);

            return SaveChangesAsync().ContinueWith(_ => round.Id);
        }

        public Task UpdateRound(Guid seasonId, Guid roundId, RoundUpdateViewModel model)
        {
            return Connection.ExecuteAsync("UPDATE Rounds SET Name=@Name, StartDate=@StartDate, EndDate=@EndDate, Updated=@now " +
                "WHERE SeasonId=@seasonId AND Id=@roundId",
                new
                {
                    model.Name,
                    model.StartDate,
                    model.EndDate,
                    now = DateTime.UtcNow,
                    seasonId,
                    roundId
                });
        }

        public async Task DeleteRound(Guid seasonId, Guid roundId)
        {
            using (var tran = Connection.BeginTransaction())
            {
                await Connection.ExecuteAsync("DELETE FROM RoundPlayers WHERE RoundId=@roundId", new { roundId }, tran);
                await Connection.ExecuteAsync("DELETE FROM Rounds WHERE SeasonId=@seasonId AND Id=@roundId", new { seasonId, roundId }, tran);

                await tran.CommitAsync();
            }
        }

        public Task<IEnumerable<RoundPlayerViewModel>> GetRoundPlayers(Guid seasonId, Guid roundId)
        {
            return Connection.QueryAsync<RoundPlayerDbo>("SELECT RP.Id, RP.PlayerId, P.Name, P.Multiplier, RP.Runs, RP.AssistedWickets, " +
                "RP.UnassistedWickets, RP.Catches, RP.Runouts, RP.Stumpings, RP.Points AS Total " +
                "FROM RoundPlayers AS RP " +
                "   INNER JOIN Players AS P ON RP.PlayerId=P.Id " +
                "   INNER JOIN Rounds AS R ON RP.RoundId=R.Id " +
                "WHERE R.SeasonId=@seasonId AND R.Id=@roundId " +
                "ORDER BY P.Name ASC", new { seasonId, roundId })
                .ContinueWith(task => task.Result.Select(x => x.ToDto()));
        }

        public async Task AddPlayerToRound(Guid seasonId, Guid roundId, RoundPlayerUpdateViewModel model)
        {
            var player = new RoundPlayer
            {
                Id = Guid.NewGuid(),
                RoundId = roundId,
                PlayerId = model.PlayerId,
                Runs = model.Points.Runs,
                UnassistedWickets = model.Points.UnassistedWickets,
                AssistedWickets = model.Points.AssistedWickets,
                Catches = model.Points.Catches,
                Runouts = model.Points.Runouts,
                Stumpings = model.Points.Stumpings,
                Created = DateTime.UtcNow,
                Points = await CalculatePoints(seasonId, model.PlayerId, model.Points)
            };

            RoundPlayers.Add(player);

            await SaveChangesAsync();
        }

        public async Task UpdatePlayerInRound(Guid seasonId, Guid roundId, Guid id, RoundPlayerUpdateViewModel model)
        {
            await Connection.ExecuteAsync("UPDATE RoundPlayers SET Runs=@Runs, UnassistedWickets=@UnassistedWickets, AssistedWickets=@AssistedWickets, " +
                "Catches=@Catches, Runouts=@Runouts, Stumpings=@Stumpings, Points=@Points, Updated=@now " +
                "WHERE RoundId=@roundId AND Id=@id AND PlayerId=@PlayerId",
                new
                {
                    roundId,
                    id,
                    model.PlayerId,
                    model.Points.Runs,
                    model.Points.UnassistedWickets,
                    model.Points.AssistedWickets,
                    model.Points.Catches,
                    model.Points.Runouts,
                    model.Points.Stumpings,
                    now = DateTime.UtcNow,
                    Points = await CalculatePoints(seasonId, model.PlayerId, model.Points)
                });
        }

        public async Task<int> CalculatePoints(Guid seasonId, Guid playerId, PointViewModel points)
        {
            var season = await GetSeasonAsync(seasonId);
            var player = await GetPlayerAsync(seasonId, playerId);

            if (season == null || player == null)
                return 0;

            return (season.PointDefinition * points) * (int)player.Multiplier;
        }

        public Task DeletePlayerFromRound(Guid seasonId, Guid roundId, Guid id)
        {
            return Connection.ExecuteAsync("DELETE FROM RoundPlayers WHERE RoundId=@roundId AND Id=@id", new { roundId, id });
        }

        public Task DeleteTeamRoundResults(Guid roundId)
        {
            return Connection.ExecuteAsync("DELETE FROM TeamRoundRanks WHERE RoundId=@roundId; DELETE FROM TeamRoundResults WHERE RoundId=@roundId", new { roundId });
        }

        public Task<IEnumerable<TeamPlayer>> GetTeamPlayersForRound(Guid teamId, Guid roundId)
        {
            return Connection.QueryAsync<TeamPlayer>("SELECT TP.* " +
                "FROM TeamPlayers AS TP " +
                "    CROSS APPLY(SELECT StartDate, EndDate FROM Rounds WHERE Id = @roundId) AS R " +
                "WHERE TP.TeamId = @teamId AND TP.Created < R.StartDate AND (TP.Removed = 0 OR TP.Updated > R.EndDate); ",
                new { teamId, roundId });
        }

        public Task<TeamCaptain> GetTeamCaptainsForRound(Guid teamId, Guid roundId)
        {
            return Connection.QueryFirstOrDefaultAsync<TeamCaptain>("SELECT TOP(1) TC.* " +
                "FROM TeamCaptains AS TC " +
                "    CROSS APPLY(SELECT StartDate, EndDate FROM Rounds WHERE Id = @roundId) AS R " +
                "WHERE TC.TeamId = @teamId AND TC.Created < R.StartDate AND(TC.Removed = 0 OR TC.Updated > R.EndDate) " +
                "ORDER BY TC.Created DESC",
                new { teamId, roundId });
        }

        public async Task UpdateRoundStatus(Guid roundId, RoundStateType newStatus)
        {
            var round = await Rounds.FindAsync(roundId);

            if (round == null) return;

            if (newStatus != round.Status)
            {
                round.Status = newStatus;
                Rounds.Update(round);

                await SaveChangesAsync();
            }
        }

        public async Task ReopenRound(Guid roundId)
        {
            var round = await Rounds.FindAsync(roundId);

            if (round == null || round.Status != RoundStateType.Completed)
                return;

            // Delete any of the ranking or results for this round
            await Connection.ExecuteAsync("DELETE FROM TeamRoundRanks WHERE RoundId=@roundId;" +
                "DELETE FROM TeamRoundResults WHERE RoundId=@roundId", new { roundId });

            round.Status = RoundStateType.Creating;
            Rounds.Update(round);

            await SaveChangesAsync();
        }

        public Task CreateRankingsForRound(Guid roundId)
        {
            return Connection.ExecuteAsync("DECLARE @roundStart datetimeoffset; " +
                "DECLARE @seasonId uniqueidentifier; " +
                "SELECT @roundStart=StartDate, @seasonId=SeasonId FROM Rounds WHERE Id = @roundId; " +
                "DELETE FROM TeamRoundRanks WHERE RoundId = @roundId; " +
                "INSERT INTO TeamRoundRanks(Id, TeamId, RoundId, RoundRank, SeasonRank, Created) " +
                "SELECT NEWID(), TR.TeamId, TR.RoundId, RR.Rank, SR.Rank, @now " +
                "FROM TeamRoundResults AS TR " +
                "    LEFT OUTER JOIN(SELECT TeamId, RANK() OVER (ORDER BY Points DESC) AS Rank FROM TeamRoundResults WHERE RoundId = @roundId) AS RR ON TR.TeamId = RR.TeamId " +
                "    LEFT OUTER JOIN(SELECT IT.TeamId, RANK() OVER(ORDER BY SUM(IT.Points) DESC) AS Rank FROM TeamRoundResults AS IT INNER JOIN Rounds AS IR ON IR.Id = IT.RoundId WHERE IR.StartDate <= @roundStart AND IR.SeasonId=@seasonId GROUP BY IT.TeamId) AS SR ON TR.TeamId = SR.TeamId " +
                "WHERE TR.RoundId = @roundId", new { roundId, now = DateTime.UtcNow });
        }

        public class RoundPlayerDbo : PointViewModel
        {
            public Guid Id { get; set; }
            public Guid PlayerId { get; set; }
            public string Name { get; set; }
            public decimal Multiplier { get; set; }
            public int Total { get; set; }

            public RoundPlayerViewModel ToDto()
            {
                return new RoundPlayerViewModel
                {
                    Id = Id,
                    Multiplier = Multiplier,
                    Name = Name,
                    PlayerId = PlayerId,
                    Total = Total,
                    Points = new PointViewModel
                    {
                        Runs = Runs,
                        AssistedWickets = AssistedWickets,
                        Catches = Catches,
                        Runouts = Runouts,
                        Stumpings = Stumpings,
                        UnassistedWickets = UnassistedWickets
                    }
                };
            }
        }

        #endregion
    }
}
