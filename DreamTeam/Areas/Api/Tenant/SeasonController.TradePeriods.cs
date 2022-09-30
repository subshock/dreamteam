using DreamTeam.Areas.Api.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/tradeperiods")]
        public async Task<IActionResult> GetTradePeriods(Guid seasonId)
        {
            return Ok(await _db.GetTradePeriods(seasonId));
        }

        [HttpPost("{seasonId:guid}/tradeperiods")]
        public async Task<IActionResult> AddTradePeriod(Guid seasonId, [FromBody] TradePeriodUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.AddTradePeriod(seasonId, model);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/tradeperiods/{id:guid}")]
        public async Task<IActionResult> UpdateTradePeriod(Guid seasonId, Guid id, [FromBody] TradePeriodUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdateTradePeriod(id, model);

            return Ok();
        }

        [HttpDelete("{seasonId:guid}/tradeperiods/{id:guid}")]
        public async Task<IActionResult> DeleteTradePeriod(Guid seasonId, Guid id)
        {
            await _db.DeleteTradePeriod(seasonId, id);

            return Ok();
        }
    }
}
