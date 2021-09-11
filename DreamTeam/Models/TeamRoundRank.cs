using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class TeamRoundRank : BaseEntity
    {
        public Guid TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team Team { get; set; }

        public Guid RoundId { get; set; }
        [ForeignKey("RoundId")]
        public Round Round { get; set; }

        public int RoundRank { get; set; }
        public int SeasonRank { get; set; }
    }
}
