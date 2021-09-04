using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class Transaction
    {
        [Key]
        public Guid Id { get; set; }
        public DateTimeOffset Created { get; set; }
        public Team Team { get; set; }
        public TransactionType Type { get; set; }
        public Player Player { get; set; }
        public Round Round { get; set; }
        public int Amount { get; set; }
    }
}
