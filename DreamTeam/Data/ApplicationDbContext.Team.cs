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
            return Connection.QueryAsync<TeamSummaryViewModel>("SELECT T.Id, T.Created, T.Updated, T.Name, COALESCE(U.Name, U.UserName, 'Unknown') AS Owner, T.Valid, T.Balance " +
                "FROM Teams AS T " +
                "   INNER JOIN AspNetUsers AS U ON T.OwnerId=U.Id " +
                "WHERE SeasonId=@seasonId ORDER BY T.Name, COALESCE(U.Name, U.UserName)", new { seasonId });
        }
    }
}
