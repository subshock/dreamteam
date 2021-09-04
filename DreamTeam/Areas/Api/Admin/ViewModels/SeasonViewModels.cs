using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class SeasonSummaryViewModel
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }

        public string Name { get; set; }
        public SeasonStateType State { get; set; }
    }

    public class SeasonViewModel
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }

        public string Name { get; set; }
        public SeasonStateType State { get; set; }

        public int Budget { get; set; }
        public decimal Cost { get; set; }

        public PointViewModel PointDefinition { get; set; }

        public int Players { get; set; }
        public int Teams { get; set; }
        public int Rounds { get; set; }
    }

    public class UpdateSeasonViewModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int Budget { get; set; }
        [Required]
        public decimal Cost { get; set; }
        [Required]
        public PointViewModel PointDefinition { get; set; }
    }
}
