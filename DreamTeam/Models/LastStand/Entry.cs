using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models.LastStand
{
    [Table("Entry", Schema = "LastStand")]
    public class Entry : BaseEntity
    {
        public Guid CompetitionId{ get; set; }

        [ForeignKey("CompetitionId")]
        public Competition Competition { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string TransactionId { get; set; }
        public bool Active { get; set; }
    }
}
