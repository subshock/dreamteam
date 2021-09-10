using DreamTeam.Data;
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

        public TeamUserController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet()]
        public async Task<IActionResult> GetTeamsForUser()
        {
            return Ok(await _db.GetTeamsForUser(UserId));
        }

        [HttpGet("{teamId:guid}")]
        public async Task<IActionResult> GetTeam(Guid teamId)
        {
            return Ok(await _db.GetUserTeam(UserId, teamId));
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
