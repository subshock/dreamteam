using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
