using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    public class PaymentController : BaseAdminController
    {
        private readonly ApplicationDbContext _db;

        public PaymentController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaymentList(PaymentSearchModel model)
        {
            model = model ?? new PaymentSearchModel { From = DateTime.Now.Date.Subtract(new TimeSpan(30, 0, 0, 0, 0)), To = DateTime.Now.Date };

            return Ok(await _db.SearchPayments(model));
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPayment(Guid id)
        {
            var payment = await _db.GetPayment(id);

            if (payment == null)
                return NotFound();

            var teams = await _db.GetTeamsByRegistrationToken(payment.TokenId);

            return Ok(new
            {
                Payment = payment,
                Teams = teams
            });
        }
    }
}
