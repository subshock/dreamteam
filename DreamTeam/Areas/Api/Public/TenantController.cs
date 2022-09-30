using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public
{
    [Route("api/public/[controller]")]
    public class TenantController : Controller
    {
        private readonly ApplicationDbContext _db;

        public TenantController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetTenant(string slug)
        {
            var obj = await _db.GetTenantBySlug(slug);

            if (obj != null && obj.Enabled)
                return Ok(new
                {
                    obj.Slug,
                    obj.Name,
                    obj.UsePaymentGateway
                });

            return NotFound();
        }

        [HttpGet]
        public async Task<IActionResult> GetTenants()
        {
            return Ok(await _db.GetTenantSeasons(null, true));
        }

        [HttpGet("{slug}/seasons")]
        public async Task<IActionResult> GetTenantSeasons(string slug)
        {
            return Ok((await _db.GetTenantSeasons(slug, true)).FirstOrDefault());
        }
    }
}
