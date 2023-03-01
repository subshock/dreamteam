using DreamTeam.Areas.Api.Public.ViewModels.LastStand;
using DreamTeam.Data;
using DreamTeam.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public
{
    [Route("api/public/[controller]")]
    public class LastStandController : BaseController
    {
        private readonly ApplicationDbContext _db;
        private readonly SquarePaymentService _paymentSvc;


        public LastStandController(ApplicationDbContext db, SquarePaymentService paymentSvc)
        {
            _db = db;
            _paymentSvc = paymentSvc;
        }

        [HttpGet("competition")]
        public async Task<IActionResult> GetActiveCompetition()
        {
            var comp = await _db.LastStandGetActiveCompetition();

            if (comp == null)
                return NotFound();

            return Ok(comp);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var competition = await _db.LastStandCompetitions.FirstAsync(x => x.Id == model.CompetitionId);

            var paymentResult = await _paymentSvc.Payment(competition.Cost, 1, model.PaymentToken, null, model.Email);

            await _db.LogPayment(paymentResult);

            if (!paymentResult.Succeeded)
            {
                return Ok(new { Success = false, Error = paymentResult.Exception.Errors });
            }

            var registrationToken = paymentResult.Response?.Payment?.Id ?? null;

            await _db.LastStandRegisterEntry(model, registrationToken);

            return Ok(new
            {
                Success = true,
                Payment = false,
                Messages = new
                {
                    Total = paymentResult.Response?.Payment?.TotalMoney ?? new Square.Models.Money(Convert.ToInt32(competition.Cost * 100), "AUD"),
                    Card = new
                    {
                        Brand = paymentResult.Response.Payment.CardDetails.Card.CardBrand,
                        Last4 = paymentResult.Response.Payment.CardDetails.Card.Last4
                    },
                    paymentResult.Response?.Payment?.ReceiptUrl
                }
            });
        }
    }
}
