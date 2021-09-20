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
        public Task<IEnumerable<TeamLeaderboardReportViewModel>> GetTeamLeaderboardReport(Guid seasonId, Guid? roundId)
        {
            return Connection.QueryAsync<TeamLeaderboardReportViewModel>("SELECT RANK() OVER (ORDER BY SUM(TRR.Points) DESC) AS [Rank], " +
                "    T.Id, T.Name, T.Owner, " +
                "    SUM(TRR.Runs) AS Runs, SUM(TRR.UnassistedWickets) AS UnassistedWickets, SUM(TRR.AssistedWickets) AS AssistedWickets, " +
                "    SUM(TRR.Catches) AS Catches, SUM(TRR.Runouts) AS Runouts, SUM(TRR.Stumpings) AS Stumpings, SUM(TRR.Points) AS Points " +
                "FROM Rounds AS R " +
                "    INNER JOIN TeamRoundResults AS TRR ON R.Id = TRR.RoundId " +
                "    INNER JOIN Teams AS T ON TRR.TeamId = T.Id " +
                "WHERE R.SeasonId = @seasonId AND R.Status = 1 AND(@roundId Is Null OR R.Id = @roundId) " +
                "GROUP BY T.Id, T.Name, T.Owner " +
                "ORDER BY[Rank]", new { seasonId, roundId });
        }

        public Task<IEnumerable<PlayerLeaderboardReportViewModel>> GetPlayerLeaderboardReport(Guid seasonId, Guid? roundId)
        {
            return Connection.QueryAsync<PlayerLeaderboardReportViewModel>("SELECT RANK() OVER (ORDER BY SUM(RP.Points) DESC) AS [Rank], " +
                "    P.Id, P.Name, P.Multiplier, SUM(RP.Runs) AS Runs, SUM(RP.UnassistedWickets) AS UnassistedWickets, SUM(RP.AssistedWickets) AS AssistedWickets, " +
                "    SUM(RP.Catches) AS Catches, SUM(RP.Runouts) AS Runouts, SUM(RP.Stumpings) AS Stumpings, SUM(RP.Points) AS Points " +
                "FROM Rounds AS R " +
                "    INNER JOIN RoundPlayers AS RP ON RP.RoundId = R.Id " +
                "    INNER JOIN Players AS P ON RP.PlayerId = P.Id " +
                "WHERE R.SeasonId = @seasonId AND R.Status = 1 AND(@roundId Is Null OR R.Id = @roundId) " +
                "GROUP BY P.Id, P.Name " +
                "ORDER BY[Rank]", new { seasonId, roundId });
        }
    }
}
