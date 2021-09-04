using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class RoundPlayer : BaseEntity, IPointDefinition
    {
        public Guid RoundId { get; set; }
        [ForeignKey("RoundId")]
        public Round Round { get; set; }

        public Guid PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player Player { get; set; }

        public int Runs { get; set; }
        public int UnassistedWickets { get; set; }
        public int AssistedWickets { get; set; }
        public int Catches { get; set; }
        public int Runouts { get; set; }
        public int Stumpings { get; set; }
    }
}
