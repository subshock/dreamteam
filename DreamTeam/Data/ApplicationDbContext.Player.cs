using Dapper;
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
        #region Player operations

        public Task<IEnumerable<PlayerViewModel>> GetPlayersAsync(Guid seasonId)
        {
            return Connection.QueryAsync<PlayerViewModel>("SELECT Id, Name, Cost, Multiplier FROM Players WHERE SeasonId=@seasonId ORDER BY Name ASC", new { seasonId });
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
