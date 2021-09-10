using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public
{
    [Route("api/public/[controller]")]
    public class SeasonController : BaseController
    {
        private readonly ApplicationDbContext _db;

        public SeasonController(ApplicationDbContext db)
        {
            _db = db;
        }

       [HttpGet("current")]
       public async Task<IActionResult> GetCurrentSeason()
        {
            var obj = await _db.PublicGetSeasonInfo();

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpGet("{seasonId:guid}/players")]
        public async Task<IActionResult> GetSeasonPlayers(Guid seasonId)
        {
            return Ok(await _db.GetPlayersWithPointsAsync(seasonId));
        }
    }
}
