using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class TradePeriod : BaseEntity
    {
        public Guid SeasonId { get; set; }
        [ForeignKey("SeasonId")]
        public Season Season { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public int TradeLimit { get; set; }
    }
}
