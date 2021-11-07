using Dapper;
using DreamTeam.Areas.Api.Public.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        #region Public data access

        public async Task<PublicSeasonInfoViewModel> PublicGetSeasonInfo(Guid? id = null)
        {
            var season = await Connection.QueryFirstOrDefaultAsync<PublicSeasonInfoViewModel>("SELECT Id, Name, Status, Cost, Budget, Runs, " +
                "UnassistedWickets, AssistedWickets, Catches, Runouts, Stumpings " +
                "FROM Seasons WHERE (@id Is Null OR Id=@id)", new { id });

            if (season == null) return season;

            season.TradePeriod = await GetCurrentTradePeriod(season.Id);

            return season;
        }

        #endregion
    }
}
