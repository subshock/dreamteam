using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api
{
    public class PointViewModel : IPointDefinition
    {
        [Required]
        public int Runs { get; set; }
        [Required, Display(Name = "Unassisted Wickets")]
        public int UnassistedWickets { get; set; }
        [Required, Display(Name = "Assisted Wickets")]
        public int AssistedWickets { get; set; }
        [Required]
        public int Catches { get; set; }
        [Required]
        public int Runouts { get; set; }
        [Required]
        public int Stumpings { get; set; }

        public PointViewModel() { }

        public static int operator * (PointViewModel a, PointViewModel b)
        {
            if (a == null || b == null) return 0;

            return (a.Runs * b.Runs)
                + (a.AssistedWickets * b.AssistedWickets)
                + (a.UnassistedWickets * b.UnassistedWickets)
                + (a.Catches * b.Catches)
                + (a.Runouts * b.Runouts)
                + (a.Stumpings * b.Stumpings);
        }

    }
}
