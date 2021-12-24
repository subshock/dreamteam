using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task<List<TradePeriod>> GetTradePeriods(Guid seasonId)
        {
            return TradePeriods.Where(x => x.SeasonId == seasonId).OrderBy(x => x.StartDate).ThenBy(x => x.EndDate).ToListAsync();
        }

        public Task<Guid> AddTradePeriod(Guid seasonId, TradePeriodUpdateViewModel model)
        {
            var obj = new TradePeriod
            {
                Id = Guid.NewGuid(),
                SeasonId = seasonId,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                Created = DateTime.UtcNow,
                TradeLimit = model.TradeLimit
            };

            TradePeriods.Add(obj);

            return SaveChangesAsync().ContinueWith(_ => obj.Id);
        }

        public async Task UpdateTradePeriod(Guid id, TradePeriodUpdateViewModel model)
        {
            var obj = await TradePeriods.FindAsync(id);

            if (obj == null) return;

            obj.StartDate = model.StartDate;
            obj.EndDate = model.EndDate;
            obj.TradeLimit = model.TradeLimit;
            obj.Updated = DateTime.UtcNow;

            TradePeriods.Update(obj);

            await SaveChangesAsync();
        }

        public Task DeleteTradePeriod(Guid seasonId, Guid tradePeriodId)
        {
            return Connection.ExecuteAsync("DELETE FROM TradePeriods WHERE Id=@tradePeriodId AND SeasonId=@seasonId", new { seasonId, tradePeriodId });
        }

        public Task<PublicTradePeriodViewModel> GetCurrentTradePeriod(Guid seasonId)
        {
            return Connection.QueryFirstOrDefaultAsync<PublicTradePeriodViewModel>(
                "SELECT Id, StartDate, EndDate, TradeLimit, 2 AS Type FROM TradePeriods WHERE SeasonId=@seasonId AND StartDate<=@now AND EndDate>@now " +
                "UNION " +
                "SELECT NULL, S.Created, S.RegistrationEndDate, 0, 1 AS Type FROM Seasons AS S WHERE S.Id = @seasonId AND S.RegistrationEndDate Is Not Null AND S.RegistrationEndDate > @now", 
                new { seasonId, now = DateTime.UtcNow });
        }

        public Task<PublicTradePeriodViewModel> GetCurrentTradePeriodByTeam(Guid teamId)
        {
            return Connection.QueryFirstOrDefaultAsync<PublicTradePeriodViewModel>("SELECT TP.Id, TP.StartDate, TP.EndDate, TP.TradeLimit, 2 AS Type " +
                "FROM TradePeriods TP INNER JOIN Teams AS T ON TP.SeasonId = T.SeasonId " +
                "WHERE T.Id = @teamId AND TP.StartDate <= @now AND TP.EndDate>@now " +
                "UNION " +
                "SELECT NULL, S.Updated, S.RegistrationEndDate, 0, 1 AS Type " +
                "FROM Seasons AS S INNER JOIN Teams AS T ON S.Id = T.SeasonId " +
                "WHERE T.Id = @teamId AND S.RegistrationEndDate Is Not Null AND S.RegistrationEndDate > @now", new { teamId, now = DateTime.UtcNow });
        }

        public Task<bool> IsTradePeriodActive(Guid seasonId)
        {
            return Connection.ExecuteScalarAsync<int>("SELECT 1 FROM TradePeriods WHERE SeasonId=@seasonId AND @now >= StartDate AND @now < EndDate",
                new { seasonId })
                .ContinueWith(x => x.Result != 0);
        }
    }
}
