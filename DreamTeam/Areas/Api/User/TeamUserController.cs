﻿using DreamTeam.Areas.Api.User.ViewModels;
using DreamTeam.Data;
using DreamTeam.Models;
using DreamTeam.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.User
{
    [Route("api/user/teams")]
    public class TeamUserController : BaseUserController
    {
        private readonly ApplicationDbContext _db;
        private readonly TeamManagementService _teamSvc;
        private readonly SquarePaymentService _paymentSvc;
        private readonly ManualPaymentService _manualPaymentSvc;

        public TeamUserController(ApplicationDbContext db, TeamManagementService teamSvc, SquarePaymentService paymentSvc, ManualPaymentService manualPaymentSvc)
        {
            _db = db;
            _teamSvc = teamSvc;
            _paymentSvc = paymentSvc;
            _manualPaymentSvc = manualPaymentSvc;
        }

        [HttpGet()]
        public async Task<IActionResult> GetTeamsForUser()
        {
            return Ok(await _db.GetTeamsForUser(UserId));
        }

        [HttpGet("season/{seasonId:guid}")]
        public async Task<IActionResult> GetTeamsForUserBySeason(Guid seasonId)
        {
            return Ok(await _db.GetTeamsForUser(UserId, seasonId));
        }

        [HttpGet("{teamId:guid}")]
        public async Task<IActionResult> GetTeam(Guid teamId)
        {
            var tradePeriod = await _db.GetCurrentTradePeriodByTeam(teamId);
            var team = await _db.GetUserTeam(UserId, teamId, tradePeriod?.Id);

            if (team == null)
                return NotFound();

            return Ok(new
            {
                team,
                tradePeriod
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterTeams([FromBody] RegisterTeamsModel model, [FromServices] UserManager<ApplicationUser> userManager)
        {
            if (!ModelState.IsValid)
                return Ok(new { Success = false, Error = ModelState });

            var season = await _db.GetSeasonAsync(model.SeasonId);
            var tenant = season != null ? await _db.GetTenant(season.TenantId) : null;

            if (tenant == null || season == null || !_db.CanAddTeamsToSeason(season.Status, season.RegistrationEndDate))
            {
                ModelState.AddModelError("season", "Registering teams is forbidden");
                return Ok(new { Success = false, Error = ModelState });
            }

            var user = (await userManager.FindByIdAsync(UserId));

            if (user == null)
                return BadRequest("User does not exist");

            IPaymentService paymentSvc = tenant.UsePaymentGateway ? _paymentSvc : _manualPaymentSvc;

            var paymentResult = await paymentSvc.Payment(season.Cost, model.Teams.Count, model.PaymentToken, model.VerificationToken, user.Email);

            await _db.LogPayment(paymentResult);

            if (!paymentResult.Succeeded)
            {
                return Ok(new { Success = false, Error = paymentResult.Exception.Errors });
            }

            var registrationToken = paymentResult.Response?.Payment?.Id ?? null;

            await _db.RegisterTeams(model, UserId, registrationToken);

            return Ok(new
            {
                Success = true,
                Payment = false,
                Messages = new
                {
                    Total = paymentResult.Response?.Payment?.TotalMoney ?? new Square.Models.Money(Convert.ToInt32(season.Cost * model.Teams.Count * 100), "AUD"),
                    Card = tenant.UsePaymentGateway ? new
                    {
                        Brand = paymentResult.Response.Payment.CardDetails.Card.CardBrand,
                        Last4 = paymentResult.Response.Payment.CardDetails.Card.Last4
                    } : null,
                    paymentResult.Response?.Payment?.ReceiptUrl
                }
            });
        }

        [HttpPost("{teamId:guid}/details")]
        public async Task<IActionResult> UpdateTeamDetails(Guid teamId, [FromBody] RegisterTeamsModel.TeamViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var season = await _db.GetSeasonByTeam(teamId);

            if (!_db.CanAddTeamsToSeason(season.Status, season.RegistrationEndDate))
                return Forbid();

            await _db.UpdateTeamDetails(UserId, teamId, model);

            return Ok();
        }

        [HttpPost("{id:guid}/players")]
        public async Task<IActionResult> UpdateTeamPlayers(Guid id, [FromBody] UserTeamPlayersUpdateViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _teamSvc.UpdateTeam(UserId, id, model);

            return Ok(result);
        }

        public class RegisterTeamsModel : IValidatableObject
        {
            [Required]
            public Guid SeasonId { get; set; }

            [Required]
            public string PaymentToken { get; set; }
            public string VerificationToken { get; set; }

            [Required]
            public List<TeamViewModel> Teams { get; set; }

            public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
            {
                if (Teams?.Count == 0)
                    yield return new ValidationResult("At least one team must be registered", new[] { "teams" });
            }

            public class TeamViewModel
            {
                [Required]
                public string Name { get; set; }
                [Required]
                public string Owner { get; set; }
            }
        }
    }
}
