using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models.LastStand
{
    [Table("EntryRound", Schema = "LastStand")]
    public class EntryRound : BaseEntity
    {
        public Guid EntryId { get; set; }
        [ForeignKey("EntryId")]
        public Entry Entry { get; set; }
        public RoundResultType Tip { get; set; }
        public int Number { get; set; }
    }
}
