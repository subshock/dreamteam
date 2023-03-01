using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models.LastStand
{
    [Table("Competition", Schema = "LastStand")]
    public class Competition : BaseEntity
    {
        public string Name { get; set; }
        public DateTimeOffset RegistrationEnds { get; set; }
        public bool Active { get; set; }
        [Column(TypeName = "money")]
        public decimal Cost { get; set; }
    }
}
