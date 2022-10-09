using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/players")]
        public async Task<IActionResult> GetSeasonPlayers(Guid seasonId)
        {
            return Ok(await _db.GetPlayersAsync(seasonId));
        }

        [HttpGet("{seasonId:guid}/players/{id:guid}")]
        public async Task<IActionResult> GetSeasonPlayer(Guid seasonId, Guid id)
        {
            var obj = await _db.GetPlayerAsync(seasonId, id);

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpPost("{seasonId:guid}/players")]
        public async Task<IActionResult> AddPlayerToSeason(Guid seasonId, [FromBody] UpdatePlayerViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _db.AddPlayerAsync(seasonId, model);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/players/{id:guid}")]
        public async Task<IActionResult> UpdatePlayerInSeason(Guid seasonId, Guid id, [FromBody] UpdatePlayerViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model);

            await _db.UpdatePlayerAsync(seasonId, id, model);

            return Ok();
        }

        [HttpDelete("{seasonId:guid}/players/{id:guid}")]
        public async Task<IActionResult> DeletePlayerFromSeason(Guid seasonId, Guid id)
        {
            await _db.DeletePlayerAsync(seasonId, id);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/players/import")]
        public async Task<IActionResult> ImportPlayers(Guid seasonId, IFormFile file,
            [FromServices] ImportService importSvc,
            [FromQuery] bool hasHeaders = false, [FromQuery] bool overwrite = false)
        {
            if (file != null)
            {
                using (var stream = file.OpenReadStream())
                {
                    var result = await importSvc.ImportPlayersFromExcel(seasonId, hasHeaders, overwrite, stream);

                    if (result.Result)
                        return Ok(result.Messages);

                    return BadRequest(result.Messages);
                }
            }

            return BadRequest(new List<string> { "File is required" });
        }
    }
}
