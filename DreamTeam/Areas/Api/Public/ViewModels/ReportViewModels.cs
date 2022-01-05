using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public.ViewModels
{
    public class TeamLeaderboardReportViewModel : PointViewModel
    {
        public int Rank { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public int Points { get; set; }
    }

    public class PlayerLeaderboardReportViewModel : PointViewModel
    {
        public int Rank { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Multiplier { get; set; }
        public int Points { get; set; }
    }

    public class PlayerReportViewModel
    {
        public PlayerDetail Player { get; set; }
        public List<RoundDetail> Rounds { get; set; }
        public List<Benchmark> Benchmarks { get; set; }

        public class PlayerDetail
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public int Cost { get; set; }
            public decimal Multiplier { get; set; }
            public int Teams { get; set; }
            public int TeamCaptain { get; set; }
            public int TeamViceCaptain { get; set; }
        }

        public class RoundDetail : PointViewModel
        {
            public int Round { get; set; }
            public int Points { get; set; }
        }

        public class RoundSummary
        {
            public int Round { get; set; }
            public int Points { get; set; }
        }

        public class Benchmark
        {
            public string Name { get; set; }
            public int Type { get; set; }
            public List<RoundSummary> Rounds { get; set; }
        }
    }

    public class TeamReportViewModel
    {
        public TeamDetail Team { get; set; }
        public List<PlayerDetail> Players { get; set; }
        public List<RoundDetail> Rounds { get; set; }
        public List<Benchmark> Benchmarks { get; set; }

        public class TeamDetail
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public string Owner { get; set; }
        }

        public class PlayerDetail
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public decimal Multiplier { get; set; }
            public int Cost { get; set; }
            public int Points { get; set; }
            public TeamPlayerType Type { get; set; }
        }

        public class RoundDetail : PointViewModel
        {
            public int Round { get; set; }
            public int Points { get; set; }
            public int RoundRank { get; set; }
            public int SeasonRank { get; set; }
        }

        public class Benchmark
        {
            public string Name { get; set; }
            public int Type { get; set; }
            public List<RoundSummary> Rounds { get; set; }
        }

        public class RoundSummary
        {
            public int Points { get; set; }
            public int? RoundRank { get; set; }
            public int? SeasonRank { get; set; }
        }
    }

    public class PrizeReportViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Team { get; set; }
        public string Owner { get; set; }
        public int Points { get; set; }
    }
}
