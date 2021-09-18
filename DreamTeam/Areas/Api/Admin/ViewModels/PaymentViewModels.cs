using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class PaymentSummaryViewModel
    {
        public Guid Id { get; set; }
        public string TokenId { get; set; }
        public DateTimeOffset Created { get; set; }
        public bool Success { get; set; }
    }

    public enum PaymentSuccessType
    {
        Any = 0,
        Succeeded = 1,
        Failed = 2
    }

    public class PaymentSearchModel
    {
        [FromQuery]
        public DateTimeOffset? From { get; set; }
        [FromQuery]
        public DateTimeOffset? To { get; set; }
        [FromQuery]
        public string Token { get; set; }
        [FromQuery]
        public PaymentSuccessType Status { get; set; }
    }

    public class PaymentDetailViewModel : PaymentSummaryViewModel
    {
        public JsonDocument PaymentDetails { get; set; }
    }
}
