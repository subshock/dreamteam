using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    public class SystemController : BaseAdminController
    {
        [HttpGet("cors")]
        public IActionResult GetCors([FromServices] IOptions<CorsOptions> corsOptions)
        {
            if (corsOptions == null || corsOptions.Value == null) return NotFound();

            var policy = corsOptions.Value.GetPolicy("AllowSpecificOrigins");

            return Ok(new
            {
                policy.Headers,
                policy.Origins,
                policy.AllowAnyOrigin,
                policy.AllowAnyHeader
            });
        }
    }
}
