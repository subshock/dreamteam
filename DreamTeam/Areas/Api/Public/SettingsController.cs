using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public
{
    [Route("api/public/[controller]")]
    public class SettingsController : BaseController
    {
        [HttpGet("payment")]
        public IActionResult GetPaymentSettings([FromServices] IOptionsSnapshot<Services.SquarePaymentApiOptions> paymentOptions)
        {
            return Ok(new
            {
                ApplicationId = paymentOptions.Value.ApplicationId,
                LocationId = paymentOptions.Value.LocationId,
                WebSdkUrl = paymentOptions.Value.WebSdkUrl
            });
        }
    }
}
