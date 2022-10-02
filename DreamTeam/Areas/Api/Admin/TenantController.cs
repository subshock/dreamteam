using DreamTeam.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    [Authorize(Policy = "SysAdmin")]
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
            return Ok(await _db.GetAllTenants());
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTenant(Guid id)
        {
            var item = await _db.GetTenant(id);

            if (item == null) return NotFound();

            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddTenant([FromBody] AddUpdateTenantModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.AddTenant(model);

            return Ok();
        }

        [HttpPost("{slug}")]
        public async Task<IActionResult> UpdateTenant(string slug, [FromBody] AddUpdateTenantModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdateTenant(slug, model);

            return Ok();
        }

        [HttpGet("{slug}/admins")]
        public async Task<IActionResult> GetTenantAdmins(string slug)
        {
            return Ok(await _db.GetTenantAdmins(slug));
        }

        [HttpPost("{slug}/admins/{userId}")]
        public async Task<IActionResult> AddTenantAdmin(string slug, Guid userId)
        {
            await _db.AddTenantAdmin(slug, userId);
            return Ok();
        }

        [HttpDelete("{slug}/admins/{userId}")]
        public async Task<IActionResult> RemoveTenantAdmin(string slug, Guid userId)
        {
            await _db.RemoveTenantAdmin(slug, userId);
            return Ok();
        }
    }
}
