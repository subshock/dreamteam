using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/rounds")]
        public async Task<IActionResult> GetRounds(Guid seasonId)
        {
            return Ok(await _db.GetRounds(seasonId));
        }

        [HttpGet("{seasonId:guid}/rounds/{roundId:guid}")]
        public async Task<IActionResult> GetRound(Guid seasonId, Guid roundId)
        {
            var obj = await _db.GetRound(seasonId, roundId);

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpPost("{seasonId:guid}/rounds")]
        public async Task<IActionResult> AddRound(Guid seasonId, [FromBody] RoundUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(new { Id = await _db.AddRound(seasonId, model) });
        }

        [HttpPost("{seasonId:guid}/rounds/{roundId:guid}")]
        public async Task<IActionResult> UpdateRound(Guid seasonId, Guid roundId, [FromBody] RoundUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdateRound(seasonId, roundId, model);

            return Ok();
        }

        [HttpDelete("{seasonId:guid}/rounds/{roundId:guid}")]
        public async Task<IActionResult> DeleteRound(Guid seasonId, Guid roundId)
        {
            await _db.DeleteRound(seasonId, roundId);

            return Ok();
        }

        [HttpGet("{seasonId:guid}/rounds/{roundId:guid}/players")]
        public async Task<IActionResult> GetRoundPlayers(Guid seasonId, Guid roundId)
        {
            return Ok(await _db.GetRoundPlayers(seasonId, roundId));
        }

        [HttpPost("{seasonId:guid}/rounds/{roundId:guid}/players")]
        public async Task<IActionResult> AddPlayerToRound(Guid seasonId, Guid roundId, [FromBody] RoundPlayerUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.AddPlayerToRound(seasonId, roundId, model);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/rounds/{roundId:guid}/players/{playerId:guid}")]
        public async Task<IActionResult> UpdatePlayerInRound(Guid seasonId, Guid roundId, Guid playerId, [FromBody] RoundPlayerUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdatePlayerInRound(seasonId, roundId, playerId, model);

            return Ok();
        }

        [HttpDelete("{seasonId:guid}/rounds/{roundId:guid}/players/{playerId:guid}")]
        public async Task<IActionResult> DeletePlayerFromRound(Guid seasonId, Guid roundId, Guid playerId)
        {
            await _db.DeletePlayerFromRound(seasonId, roundId, playerId);

            return Ok();
        }

        [HttpPost("{seasonId:guid}/rounds/{roundId:guid}/complete")]
        public async Task<IActionResult> CompleteRound([FromServices] TaskLogService taskLogSvc, Guid seasonId, Guid roundId)
        {
            var taskId = await taskLogSvc.StartTaskLog(RoundCompletedBackgroundTask.TaskTitle);

            await _db.UpdateRoundStatus(roundId, Models.RoundStateType.ReadyToCalculate);

            Hangfire.BackgroundJob.Enqueue<RoundCompletedBackgroundTask>(x => x.Run(taskId, roundId));

            return Ok(new { Token = taskId });
        }

        [HttpPost("{seasonId:guid}/rounds/{roundId:guid}/reopen")]
        public async Task<IActionResult> ReopenRound(Guid seasonId, Guid roundId)
        {
            await _db.ReopenRound(roundId);

            return Ok();
        }
    }
}
