using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.User
{
    [Route("api/user/seasons")]
    public class SeasonUserController : BaseUserController
    {
        private readonly ApplicationDbContext _db;

        public SeasonUserController(ApplicationDbContext db)
        {
            _db = db;
        }


        [HttpGet("trade-period/current")]
        public async Task<IActionResult> GetCurrentTradePeriod()
        {
            var season = await _db.PublicGetSeasonInfo();

            if (season == null)
                return NotFound();

            return Ok(await _db.GetCurrentTradePeriod(season.Id));
        }
    }
}
