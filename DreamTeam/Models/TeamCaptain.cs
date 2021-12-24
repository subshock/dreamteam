using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class TeamCaptain : BaseEntity
    {
        public Guid TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        public Guid? TradePeriodId { get; set; }
        [ForeignKey("TradePeriodId")]
        public TradePeriod TradePeriod { get; set; }

        public Guid CaptainId { get; set; }
        [ForeignKey("CaptainId")]
        public Player Captain { get; set; }

        public Guid ViceCaptainId { get; set; }
        [ForeignKey("ViceCaptainId")]
        public Player ViceCaptain { get; set; }

        public bool Removed { get; set; }
        public Guid? RemovedTradePeriodId { get; set; }
        [ForeignKey("RemovedTradePeriodId")]
        public TradePeriod RemovedTradePeriod { get; set; }

    }
}
