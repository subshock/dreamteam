using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Data;
using DreamTeam.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    [Route("api/tenant/{tenant}/[controller]")]
    public partial class SeasonController : BaseTenantController
    {
        private readonly ApplicationDbContext _db;

        public SeasonController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetSeasons(string tenant)
        {
            return Ok(await _db.GetSeasonsByTenantAsync(tenant));
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSeason(string tenant, Guid id)
        {
            var obj = await _db.GetSeasonAsync(id, tenant);

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeason(string tenant, [FromBody] UpdateSeasonViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var season = await _db.CreateSeasonAsync(tenant, model);

            return Ok(new { season.Id });
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> UpdateSeason(string tenant, Guid id, [FromBody] UpdateSeasonViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _db.UpdateSeasonAsync(tenant, id, model);

            return Ok();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteSeason(string tenant, Guid id)
        {
            await _db.DeleteSeasonAsync(tenant, id);

            return Ok();
        }

        [HttpPost("{id:guid}/status")]
        public async Task<IActionResult> ChangeSeasonStatus(string tenant, Guid id, [FromBody] SeasonStateType state)
        {
            var result = await _db.UpdateSeasonStatusAsync(tenant, id, state);

            return Ok(new { Result = result });
        }
    }
}
