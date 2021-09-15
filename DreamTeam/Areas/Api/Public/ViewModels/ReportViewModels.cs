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
        public int Points { get; set; }
    }
}
