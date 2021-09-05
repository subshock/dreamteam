using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class Team : BaseEntity
    {
        public Guid SeasonId { get; set; }

        [ForeignKey("SeasonId")]
        public Season Season { get; set; }

        public string Name { get; set; }
        public string Owner { get; set; }

        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public bool Valid { get; set; }
        public int Balance { get; set; }
        public bool Paid { get; set; }

        public string RegistrationToken { get; set; }
    }
}
