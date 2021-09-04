using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public interface IPointDefinition
    {
        int Runs { get; set; }
        int UnassistedWickets { get; set; }
        int AssistedWickets { get; set; }
        int Catches { get; set; }
        int Runouts { get; set; }
        int Stumpings { get; set; }
    }
}
