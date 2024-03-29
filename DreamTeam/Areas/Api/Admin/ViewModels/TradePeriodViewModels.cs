﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class TradePeriodUpdateViewModel
    {
        [Required]
        public DateTimeOffset StartDate { get; set; }
        [Required]
        public DateTimeOffset EndDate { get; set; }
        [Required]
        public int TradeLimit { get; set; }
    }

    public enum TradePeriodType
    {
        RegistrationEnd = 1,
        TradePeriod = 2
    }

    public class PublicTradePeriodViewModel
    {
        public Guid Id { get; set; }
        public TradePeriodType Type { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public int TradeLimit { get; set; }
    }
}
