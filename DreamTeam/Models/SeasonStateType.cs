using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public enum SeasonStateType
    {
        None = 0,
        Setup = 1,
        Registration = 2,
        Running = 3,
        TradePeriod = 4,
        Finished = 10,
        Archived = 20
    }
}
