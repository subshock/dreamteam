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
        public Task<IEnumerable<Prize>> GetPrizesForSeason(Guid seasonId)
        {
            return Connection.QueryAsync<Prize>("SELECT Id, Name, Position, Description, StartDate, EndDate FROM Prizes WHERE SeasonId=@seasonId ORDER BY SortOrder",
                new { seasonId });
        }

        public Task<Prize> GetPrize(Guid id)
        {
            return Connection.QueryFirstOrDefaultAsync<Prize>("SELECT Id, Name, Position, Description, StartDate, EndDate FROM Prizes WHERE Id=@id",
                new { id });
        }

        public async Task<Guid> AddPrize(Guid seasonId, UpdatePrizeViewModel model)
        {
            var sortOrder = await Connection.ExecuteScalarAsync<int>("SELECT MAX(SortOrder) FROM Prizes WHERE SeasonId=@seasonId", new { seasonId }) + 1;
            var prize = new Prize
            {
                Id = Guid.NewGuid(),
                Created = DateTimeOffset.Now,
                Description = model.Description,
                Name = model.Name,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                Position = model.Position,
                SeasonId = seasonId,
                SortOrder = sortOrder
            };

            Prizes.Add(prize);
            await SaveChangesAsync();

            return prize.Id;
        }

        public Task UpdatePrize(Guid id, UpdatePrizeViewModel model)
        {
            return Connection.ExecuteAsync("UPDATE Prizes SET Name=@Name, Description=@Description, StartDate=@StartDate, EndDate=@EndDate, Position=@Position, Updated=@now WHERE Id=@id",
                new
                {
                    now = DateTimeOffset.Now,
                    model.Name,
                    model.Description,
                    model.StartDate,
                    model.EndDate,
                    model.Position,
                    id
                });
        }

        public Task DeletePrize(Guid id)
        {
            return Connection.ExecuteAsync("DELETE FROM Prizes WHERE Id=@id", new { id });
        }

        public async Task SetPrizeOrder(Guid seasonId, ICollection<Guid> prizeIds)
        {
            using (var tran = Connection.BeginTransaction()) {
                var prizes = (await Connection.QueryAsync<Guid>("SELECT Id FROM Prizes WHERE SeasonId=@seasonId", new { seasonId }, tran)).ToList();

                var order = 0;
                var now = DateTimeOffset.Now;

                foreach (var id in prizeIds.Where(x => prizes.Contains(x)))
                {
                    Connection.Execute("UPDATE Prizes SET SortOrder=@order, Updated=@now WHERE Id=@id",
                        new { order, now, id }, tran);
                }

                tran.Commit();
            }
        }
    }
}
