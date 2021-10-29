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
                "GROUP BY P.Id, P.Name, P.Multiplier " +
                "ORDER BY[Rank]", new { seasonId, roundId });
        }

        public async Task<PlayerReportViewModel> GetPlayerReport(Guid seasonId, Guid playerId)
        {
            var sql = "SELECT P.Id, P.Name, P.Cost, P.Multiplier, TC.Teams, PC.TeamCaptain, PV.TeamViceCaptain " +
                "FROM Players AS P " +
                "    CROSS APPLY(SELECT COUNT(DISTINCT TeamId) AS [Teams] FROM TeamPlayers WHERE PlayerId = P.Id AND Removed = 0) AS TC " +
                "    CROSS APPLY(SELECT COUNT(DISTINCT TeamId) AS [TeamCaptain] FROM TeamCaptains WHERE Removed = 0 AND CaptainId = P.Id) AS PC " +
                "    CROSS APPLY(SELECT COUNT(DISTINCT TeamId) AS [TeamViceCaptain] FROM TeamCaptains WHERE Removed = 0 AND ViceCaptainId = P.Id) AS PV " +
                "WHERE Id = @playerId AND SeasonId = @seasonId; " +
                "SELECT R.Name AS[Round], RP.Points, RP.Runs, RP.UnassistedWickets, RP.AssistedWickets, RP.Catches, RP.Runouts, RP.Stumpings " +
                "    FROM RoundPlayers AS RP " +
                "        INNER JOIN Rounds AS R ON R.Id = RP.RoundId " +
                "WHERE RP.PlayerId = @playerId AND R.Status = 1 " +
                "ORDER BY R.Name ASC; " +
                "SELECT R.Name AS[Round], 'Average' AS[Name], AVG(RP.Points) AS Points, -1 AS[Type] " +
                "FROM Rounds AS R " +
                "    INNER JOIN RoundPlayers AS RP ON RP.RoundId = R.Id " +
                "WHERE R.Status = 1 AND R.SeasonId = @seasonId " +
                "GROUP BY R.Name " +
                "UNION ALL " +
                "SELECT R.Name AS[Round], P.Name, RP.Points, V.[Rank] AS[Type] " +
                "FROM Rounds AS R " +
                "    INNER JOIN RoundPlayers AS RP ON RP.RoundId = R.Id " +
                "    INNER JOIN(SELECT TOP(3) P.Id, ROW_NUMBER() OVER(ORDER BY SUM(RP.Points) DESC) AS[Rank] " +
                "        FROM Players AS P " +
                "            INNER JOIN RoundPlayers AS RP ON RP.PlayerId = P.Id " +
                "            INNER JOIN Rounds AS R ON R.Id = RP.RoundId " +
                "        WHERE R.Status = 1 AND R.SeasonId = @seasonId AND P.Id<> @playerId " +
                "        GROUP BY P.Id, P.Name " +
                "        ORDER BY SUM(RP.Points) DESC) AS V ON V.Id = RP.PlayerId " +
                "    INNER JOIN Players AS P ON P.Id = V.Id " +
                "WHERE R.Status = 1 AND R.SeasonId = @seasonId " +
                "ORDER BY[Round], [Type];";

            using (var rdr = await Connection.QueryMultipleAsync(sql, new { seasonId, playerId }))
            {
                var ret = new PlayerReportViewModel();

                ret.Player = await rdr.ReadFirstOrDefaultAsync<PlayerReportViewModel.PlayerDetail>();

                if (ret.Player == null) return null;

                ret.Rounds = (await rdr.ReadAsync<PlayerReportViewModel.RoundDetail>()).ToList();
                ret.Benchmarks = (await rdr.ReadAsync<ReportDbo.PlayerBenchmarkDbo>()).GroupBy(x => new { x.Type, x.Name }).Select(x => new PlayerReportViewModel.Benchmark
                {
                    Type = x.Key.Type,
                    Name = x.Key.Name,
                    Rounds = x.Select(r => new PlayerReportViewModel.RoundSummary { Points = r.Points, Round = r.Round }).ToList()
                }).ToList();

                return ret;
            }
        }

        public async Task<TeamReportViewModel> GetTeamReport(Guid seasonId, Guid teamId)
        {
            var hideTeamPlayers = await CanManageTeamAsync(seasonId);
            var sql = "SELECT Id, Name, Owner FROM Teams  WHERE Id=@teamId AND SeasonId=@seasonId AND Valid=1; " +
                "SELECT UTP.PlayerId AS Id, P.Name, P.Multiplier, UTP.Cost, " +
                "    COALESCE((SELECT SUM(RP.Points) FROM Rounds AS R INNER JOIN RoundPlayers AS RP ON R.Id = RP.RoundId WHERE R.Status = 1 AND RP.PlayerId = UTP.PlayerId), 0) AS Points, " +
                "    CASE WHEN C.IsCaptain = 1 THEN 10 WHEN VC.IsVice = 1 THEN 5 ELSE 0 END AS[Type] " +
                "FROM TeamPlayers AS UTP " +
                "    INNER JOIN Players AS P ON UTP.PlayerId = P.Id " +
                "    OUTER APPLY(SELECT TOP(1) 1 AS IsCaptain FROM TeamCaptains AS C WHERE C.TeamId = @teamId AND C.CaptainId = P.Id AND Removed = 0 ORDER BY Created DESC) AS C " +
                "    OUTER APPLY(SELECT TOP(1) 1 AS IsVice FROM TeamCaptains AS VC WHERE VC.TeamId = @teamId AND VC.ViceCaptainId = P.Id AND Removed = 0 ORDER BY Created DESC) AS VC " +
                "WHERE UTP.TeamId = @teamId AND UTP.Removed = 0 " +
                "ORDER BY CASE WHEN C.IsCaptain = 1 THEN 10 WHEN VC.IsVice = 1 THEN 5 ELSE 0 END DESC, P.Name " +
                "SELECT R.Name AS[Round], TRR.Runs, TRR.UnassistedWickets, TRR.AssistedWickets, TRR.Catches, TRR.Runouts, TRR.Stumpings, TRR.Points, TRK.RoundRank, TRK.SeasonRank " +
                "FROM Rounds AS R " +
                "    INNER JOIN TeamRoundResults AS TRR ON R.Id = TRR.RoundId " +
                "    INNER JOIN TeamRoundRanks AS TRK ON R.Id = TRK.RoundId " +
                "WHERE TRR.TeamId = @teamId AND R.Status = 1 AND R.SeasonId = @seasonId AND TRK.TeamId = @teamId " +
                "ORDER BY R.Name ASC; " +
                "SELECT R.[Name] AS[Round], 'Average' AS[Name], -1 AS[Type], AVG(TRR.Points) AS Points, NULL AS RoundRank, NULL AS SeasonRank " +
                "FROM Rounds AS R " +
                "    INNER JOIN TeamRoundResults AS TRR ON TRR.RoundId = R.Id " +
                "WHERE R.SeasonId = @seasonId AND R.Status = 1 " +
                "GROUP BY R.Name " +
                "UNION " +
                "SELECT R.[Name] AS[Round], T.[Name], RT.[Rank] AS[Type], TRR.Points, TRK.RoundRank, TRK.SeasonRank " +
                "FROM Rounds AS R " +
                "  INNER JOIN TeamRoundResults AS TRR ON TRR.RoundId = R.Id " +
                "    INNER JOIN TeamRoundRanks AS TRK ON TRK.RoundId = R.Id " +
                "    INNER JOIN Teams AS T ON T.Id = TRR.TeamId AND T.Id = TRK.TeamId " +
                "    INNER JOIN ( " +
                "        SELECT TRK.TeamId, ROW_NUMBER() OVER (ORDER BY SeasonRank ASC) AS[Rank] " +
                "        FROM TeamRoundRanks AS TRK " +
                "            INNER JOIN(SELECT TOP(1) Id FROM Rounds WHERE Status = 1 AND SeasonId = @seasonId ORDER BY Name DESC) AS LR ON LR.Id = TRK.RoundId " +
                "        WHERE TRK.TeamId<> @teamId " +
                "    ) AS RT ON RT.TeamId = T.Id AND RT.[Rank] < 4 " +
                "WHERE R.SeasonId = @seasonId AND R.Status = 1 " +
                "ORDER BY[Type], [Round]";

            using (var rdr = await Connection.QueryMultipleAsync(sql, new { seasonId, teamId }))
            {
                var ret = new TeamReportViewModel();

                ret.Team = await rdr.ReadFirstOrDefaultAsync<TeamReportViewModel.TeamDetail>();

                if (ret.Team == null) return null;

                ret.Players = (await rdr.ReadAsync<TeamReportViewModel.PlayerDetail>()).ToList();
                ret.Rounds = (await rdr.ReadAsync<TeamReportViewModel.RoundDetail>()).ToList();
                ret.Benchmarks = (await rdr.ReadAsync<ReportDbo.TeamBenchmarkDbo>()).GroupBy(x => new { x.Type, x.Name }).Select(x => new TeamReportViewModel.Benchmark
                {
                    Name = x.Key.Name,
                    Type = x.Key.Type,
                    Rounds = x.Select(r => new TeamReportViewModel.RoundSummary { Points = r.Points, RoundRank = r.RoundRank, SeasonRank = r.SeasonRank }).ToList()
                }).ToList();

                if (hideTeamPlayers)
                    ret.Players = null;

                return ret;
            }
        }

        public class ReportDbo
        {
            public class PlayerBenchmarkDbo
            {
                public int Round { get; set; }
                public string Name { get; set; }
                public int Points { get; set; }
                public int Type { get; set; }
            }

            public class TeamBenchmarkDbo
            {
                public int Round { get; set; }
                public string Name { get; set; }
                public int Type { get; set; }
                public int Points { get; set; }
                public int RoundRank { get; set; }
                public int SeasonRank { get; set; }
            }
        }
    }
}
