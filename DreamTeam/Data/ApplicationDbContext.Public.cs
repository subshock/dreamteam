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

        public Task<PublicSeasonInfoViewModel> PublicGetSeasonInfo(Guid? id = null)
        {
            return Connection.QueryFirstOrDefaultAsync<PublicSeasonInfoViewModel>("SELECT Id, Name, Status, Cost, Budget, Runs, " +
                "UnassistedWickets, AssistedWickets, Catches, Runouts, Stumpings " +
                "FROM Seasons WHERE (@id Is Null OR Id=@id)", new { id });
        }

        #endregion
    }
}
