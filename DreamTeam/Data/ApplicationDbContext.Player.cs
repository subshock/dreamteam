using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Areas.Api.Public.ViewModels;
using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        #region Player operations

        public Task<IEnumerable<PlayerViewModel>> GetPlayersAsync(Guid seasonId)
        {
            return Connection.QueryAsync<PlayerViewModel>("SELECT Id, SeasonId, Name, Cost, Multiplier FROM Players WHERE SeasonId=@seasonId ORDER BY Name ASC", new { seasonId });
        }

        public Task<IEnumerable<PlayerViewModel>> GetPlayersAsync(IEnumerable<Guid> playerIds)
        {
            if (playerIds == null || !playerIds.Any())
                return Task.FromResult(Enumerable.Empty<PlayerViewModel>());

            return Connection.QueryAsync<PlayerViewModel>("SELECT Id, SeasonId, Name, Cost, Multiplier FROM Players WHERE Id IN @playerIds", new { playerIds });
        }

        public Task<IEnumerable<PublicPlayerViewModel>> GetPlayersWithPointsAsync(Guid seasonId)
        {
            return Connection.QueryAsync<PublicPlayerViewModel>("SELECT P.Id, P.Name, P.Cost, P.Multiplier, " +
                "COALESCE(SUM(RP.Runs), 0) AS Runs, COALESCE(SUM(RP.UnassistedWickets), 0) AS UnassistedWickets, COALESCE(SUM(RP.AssistedWickets), 0) AS AssistedWickets, " +
                "COALESCE(SUM(RP.Catches), 0) AS Catches, COALESCE(SUM(RP.Runouts), 0) AS Runouts, COALESCE(SUM(RP.Stumpings), 0) AS Stumpings, COALESCE(SUM(RP.Points), 0) AS Points " +
                "FROM Players AS P " +
                "INNER JOIN Seasons AS S ON P.SeasonId = S.Id " +
                "LEFT OUTER JOIN Rounds AS R ON R.SeasonId = S.Id AND R.Status = 1 " +
                "LEFT OUTER JOIN RoundPlayers AS RP ON RP.RoundId = R.Id AND RP.PlayerId = P.Id " +
                "WHERE S.Id = @seasonId " +
                "GROUP BY P.Id, P.Name, P.Cost, P.Multiplier " +
                "ORDER BY Cost DESC, Name ASC", new { seasonId });
        }

        public Task<PlayerViewModel> GetPlayerAsync(Guid seasonId, Guid id)
        {
            return Connection.QueryFirstOrDefaultAsync<PlayerViewModel>("SELECT Id, Name, Cost, Multiplier FROM Players WHERE SeasonId=@seasonId AND Id=@id",
                new { seasonId, id });
        }

        public Task AddPlayerAsync(Guid seasonId, UpdatePlayerViewModel model)
        {
            var player = new Player
            {
                Id = Guid.NewGuid(),
                Created = DateTime.UtcNow,
                Cost = model.Cost,
                Multiplier = model.Multiplier,
                Name = model.Name,
                SeasonId = seasonId
            };

            Players.Add(player);

            return SaveChangesAsync();
        }

        public Task UpdatePlayerAsync(Guid seasonId, Guid id, UpdatePlayerViewModel model)
        {
            return Connection.ExecuteAsync("UPDATE Players SET Name=@Name, Cost=@Cost, Multiplier=@Multiplier, Updated=@now WHERE Id=@id AND SeasonId=@seasonId",
                new
                {
                    model.Name,
                    model.Cost,
                    model.Multiplier,
                    now = DateTime.UtcNow,
                    seasonId,
                    id
                });
        }

        public Task DeletePlayerAsync(Guid seasonId, Guid id)
        {
            return Connection.ExecuteAsync("DELETE FROM Players WHERE SeasonId=@seasonId AND Id=@id", new { seasonId, id });
        }

        #endregion
    }
}
