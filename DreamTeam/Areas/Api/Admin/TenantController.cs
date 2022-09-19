using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    public class TenantController : BaseAdminController
    {
        private readonly ApplicationDbContext _db;

        public TenantController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetTenants()
        {
            return Ok(await (User.IsInRole("SysAdmin") ? _db.GetAllTenants() : _db.GetTenantsByUser(UserId)));
        }
    }
}
