using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class PlayerViewModel
    {
        public Guid Id { get; set; }
        public Guid SeasonId { get; set; }
        public string Name { get; set; }
        public int Cost { get; set; }
        public decimal Multiplier { get; set; }
    }

    public class UpdatePlayerViewModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int Cost { get; set; }
        [Required]
        public decimal Multiplier { get; set; }
    }
}
