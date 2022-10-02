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
            var season = await Connection.QueryFirstOrDefaultAsync<PublicSeasonInfoViewModel>("SELECT S.Id, S.Name, S.Status, S.Cost, S.Budget, S.Runs, " +
                "S.UnassistedWickets, S.AssistedWickets, S.Catches, S.Runouts, S.Stumpings, T.Name AS Tenant, T.Slug, S.MaxPlayers " +
                "FROM Seasons AS S" +
                "   INNER JOIN Tenants AS T ON T.Id=S.TenantId " +
                "WHERE (@id Is Null OR S.Id=@id) AND T.Enabled=1 ORDER BY S.Status", new { id });

            if (season == null) return season;

            season.TradePeriod = await GetCurrentTradePeriod(season.Id);

            return season;
        }

        #endregion
    }
}
