using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public enum TransactionType
    {
        Credit = 0,
        PlayerIn = 1,
        PlayerOut = 2,
        SetCaptain = 3,
        SetViceCaptain = 4
    }
}
