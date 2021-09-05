using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class Payment : BaseEntity
    {
        public string TokenId { get; set; }
        public bool Success { get; set; }
        public string PaymentDetails { get; set; }
    }
}
