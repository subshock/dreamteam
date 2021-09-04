using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    public partial class SeasonController
    {
        [HttpGet("{seasonId:guid}/teams")]
        public async Task<IActionResult> GetTeams(Guid seasonId)
        {
            return Ok(await _db.GetTeams(seasonId));
        }
    }
}
