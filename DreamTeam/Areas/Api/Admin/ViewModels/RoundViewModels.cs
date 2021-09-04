using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class RoundSummaryViewModel
    {
        public Guid Id { get; set; }
        public int Name { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public bool Completed { get; set; }
        public int Players { get; set; }
    }

    public class RoundViewModel
    {
        public Guid Id { get; set; }
        public int Name { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool Completed { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
    }

    public class RoundUpdateViewModel
    {
        [Required]
        public int Name { get; set; }
        [Required]
        public DateTimeOffset StartDate { get; set; }
        [Required]
        public DateTimeOffset EndDate { get; set; }
    }

    public class RoundPlayerUpdateViewModel
    {
        public Guid PlayerId { get; set; }
        public PointViewModel Points { get; set; }
    }

    public class RoundPlayerViewModel
    {
        public Guid Id { get; set; }
        public Guid PlayerId { get; set; }
        public string Name { get; set; }
        public decimal Multiplier { get; set; }
        public PointViewModel Points { get; set; }
        public int Total { get; set; }
    }
}
