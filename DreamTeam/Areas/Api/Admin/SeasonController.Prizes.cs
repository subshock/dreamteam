using DreamTeam.Areas.Api.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/prizes")]
        public async Task<IActionResult> GetPrizes(Guid seasonId)
        {
            return Ok((await _db.GetPrizesForSeason(seasonId)).ToList());
        }

        [HttpGet("{seasonId:guid}/prizes/{id:guid}")]
        public async Task<IActionResult> GetPrize(Guid seasonId, Guid id)
        {
            var obj = await _db.GetPrize(id);

            if (obj == null) return NotFound();

            return Ok(obj);
        }

        [HttpPost("{seasonId:guid}/prizes")]
        public async Task<IActionResult> AddPrize(Guid seasonId, [FromBody] UpdatePrizeViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.AddPrize(seasonId, model);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/prizes/{id:guid}")]
        public async Task<IActionResult> UpdatePrize(Guid seasonId, Guid id, [FromBody] UpdatePrizeViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdatePrize(id, model);

            return Ok();
        }

        [HttpDelete("{seasonId:guid}/prizes/{id:guid}")]
        public async Task<IActionResult> DeletePrize(Guid seasonId, Guid id)
        {
            await _db.DeletePrize(id);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/prizes/order")]
        public async Task<IActionResult> SetPrizeOrder(Guid seasonId, [FromBody] List<Guid> prizeIds)
        {
            await _db.SetPrizeOrder(seasonId, prizeIds);

            return Ok();
        }
    }
}
