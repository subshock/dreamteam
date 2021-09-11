using DreamTeam.Areas.Api.User.ViewModels;
using DreamTeam.Data;
using DreamTeam.Services;
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

        public TeamUserController(ApplicationDbContext db, TeamManagementService teamSvc)
        {
            _db = db;
            _teamSvc = teamSvc;
        }

        [HttpGet()]
        public async Task<IActionResult> GetTeamsForUser()
        {
            return Ok(await _db.GetTeamsForUser(UserId));
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
        public async Task<IActionResult> RegisterTeams([FromBody] RegisterTeamsModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _db.CanAddTeamsToSeasonAsync(model.SeasonId))
            {
                ModelState.AddModelError("season", "Registering teams is forbidden");
                return BadRequest(ModelState);
            }

            await _db.RegisterTeams(model, UserId);

            return Ok();
        }

        [HttpPost("{teamId:guid}/details")]
        public async Task<IActionResult> UpdateTeamDetails(Guid teamId, [FromBody] RegisterTeamsModel.TeamViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var season = await _db.GetSeasonByTeam(teamId);

            if (season.State != Models.SeasonStateType.Registration)
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
