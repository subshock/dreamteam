﻿using Dapper;
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
            return Connection.QueryFirstOrDefaultAsync<PublicTradePeriodViewModel>("SELECT Id, StartDate, EndDate, TradeLimit " +
                "FROM TradePeriods " +
                "WHERE SeasonId=@seasonId AND StartDate>=@now AND EndDate<=@now", new { seasonId, now = DateTime.UtcNow });
        }
    }
}
