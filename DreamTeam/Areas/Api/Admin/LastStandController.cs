using System;
using System.Threading.Tasks;
using DreamTeam.Data;
using DreamTeam.Models.LastStand;
using Microsoft.AspNetCore.Mvc;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    public class LastStandController : BaseAdminController
    {
        private ApplicationDbContext _db;

        public LastStandController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompetitions()
        {
            return Ok(await _db.LastStand.GetCompetitions());
        }

        [HttpGet("competition/{id:guid}")]
        public async Task<IActionResult> GetCompetition(Guid id)
        {
            return Ok(await _db.LastStand.GetCompetition(id));
        }

        [HttpGet("competition/{id:guid}/round")]
        public async Task<IActionResult> GetRounds(Guid id)
        {
            return Ok(await _db.LastStand.GetRounds(id));
        }

        [HttpGet("competition/{id:guid}/entry")]
        public async Task<IActionResult> GetEntries(Guid id)
        {
            return Ok(await _db.LastStand.GetEntries(id));
        }

        [HttpPost("competition/{competitionId:guid}/round/{id:guid}")]
        public async Task<IActionResult> UpdateRound(Guid competitionId, Guid id, [FromBody] RoundUpdateDto round)
        {
            try
            {
                await _db.LastStand.UpdateRound(id, round);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return Ok();
        }
    }
}
