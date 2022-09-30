using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models
{
    public class SeasonContent : BaseEntity
    {
        [ForeignKey("SeasonId")]
        public Season Season { get; set; }
        public Guid SeasonId { get; set; }

        public string Name { get; set; }
        public string Content { get; set; }
    }
}
