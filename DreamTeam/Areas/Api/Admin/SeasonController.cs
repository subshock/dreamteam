using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Data;
using DreamTeam.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    public partial class SeasonController : BaseAdminController
    {
        private readonly ApplicationDbContext _db;

        public SeasonController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetSeasons()
        {
            return Ok(await _db.GetSeasonsAsync());
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSeason(Guid id)
        {
            var obj = await _db.GetSeasonAsync(id);

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeason([FromBody] UpdateSeasonViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            var season = await _db.CreateSeasonAsync(model);

            return Ok(new { season.Id });
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> UpdateSeason(Guid id, [FromBody] UpdateSeasonViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _db.UpdateSeasonAsync(id, model);

            return Ok();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteSeason(Guid id)
        {
            await _db.DeleteSeasonAsync(id);

            return Ok();
        }

        [HttpPost("{id:guid}/status")]
        public async Task<IActionResult> ChangeSeasonStatus(Guid id, [FromBody] SeasonStateType state)
        {
            var result = await _db.UpdateSeasonStateAsync(id, state);

            return Ok(new { Result = result });
        }
    }
}
