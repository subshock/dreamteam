using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class TeamPlayer : BaseEntity
    {
        public Guid TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        public Guid PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player Player { get; set; }

        public int Cost { get; set; }

        public TeamPlayerType Type { get; set; }

        public Guid? TradePeriodId { get; set; }
        [ForeignKey("TradePeriodId")]
        public TradePeriod TradePeriod { get; set; }

        public bool Removed { get; set; }
    }
}
