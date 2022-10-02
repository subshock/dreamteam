using DreamTeam.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/teams")]
        public async Task<IActionResult> GetTeams(Guid seasonId)
        {
            return Ok(await _db.GetTeams(seasonId));
        }

        [HttpPost("{seasonId:guid}/teams/{teamId:guid}/payment")]
        public async Task<IActionResult> MarkTeamAsPaid(Guid seasonId, Guid teamId)
        {
            var team = await _db.Teams.Where(x => x.Id == teamId && x.SeasonId == seasonId).FirstOrDefaultAsync();

            if (team == null)
                return NotFound();

            var token = $"MANUAL-{Guid.NewGuid():N}";

            await _db.LogPayment(new Services.PaymentResponse
            {
                Succeeded = true,
                Response = new Square.Models.CreatePaymentResponse(null, new Square.Models.Payment(id: token))
            });

            team.Paid = true;
            team.RegistrationToken = token;
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{seasonId:guid}/teams/{teamId:guid}/payment/reset")]
        public async Task<IActionResult> MarkTeamAsUnpaid(Guid seasonId, Guid teamId)
        {
            var team = await _db.Teams.Where(x => x.Id == teamId && x.SeasonId == seasonId).FirstOrDefaultAsync();

            if (team == null)
                return NotFound();

            team.Paid = false;
            team.RegistrationToken = null;
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}
