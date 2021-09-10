using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
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
            return Connection.QueryAsync<TeamSummaryViewModel>("SELECT T.Id, COALESCE(T.Updated, T.Created) AS Updated, T.Name, T.Owner, T.Valid, T.Balance, T.Paid " +
                "FROM Teams AS T " +
                "WHERE UserId=@userId ORDER BY T.Name", new { userId });
        }

        public Task<TeamSummaryViewModel> GetUserTeam(string userId, Guid teamId)
        {
            return Connection.QueryFirstOrDefaultAsync<TeamSummaryViewModel>("SELECT T.Id, COALESCE(T.Updated, T.Created) AS Updated, T.Name, T.Owner, T.Valid, T.Balance, T.Paid " +
                "FROM Teams AS T " +
                "WHERE T.Id = @teamId AND T.UserId = @userId; ", new { userId, teamId });
        }

        public async Task RegisterTeams(RegisterTeamsModel model, string userId)
        {
            var season = await GetSeasonAsync(model.SeasonId);
            var token = Guid.NewGuid();

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
                    Paid = false,
                    RegistrationToken = token.ToString(),
                    Valid = false
                };

                Teams.Add(obj);
            }

            await SaveChangesAsync();
        }
    }
}
