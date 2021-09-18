using DreamTeam.Data;
using DreamTeam.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("{seasonId}/tradeperiod/active")]
        public async Task<IActionResult> IsActiveTradePeriod(Guid seasonId)
        {
            return Ok(new { TradePeriod = await _db.IsTradePeriodActive(seasonId) });
        }

        [HttpGet("{seasonId}/rounds")]
        public async Task<IActionResult> GetCompletedRounds(Guid seasonId)
        {
            return Ok(await _db.Rounds.Where(x => x.SeasonId == seasonId && x.Status == RoundStateType.Completed).OrderBy(x => x.Name).ToListAsync());
        }

        [HttpGet("{seasonId}/reports/teams/leaderboard")]
        [HttpGet("{seasonId}/reports/teams/leaderboard/{roundId}")]
        public async Task<IActionResult> GetTeamLeaderboardReport(Guid seasonId, Guid? roundId, [FromQuery] int limit = 0)
        {
            var teams = await _db.GetTeamLeaderboardReport(seasonId, roundId);

            if (limit > 0)
                teams = teams.Take(limit);

            return Ok(teams);
        }

        [HttpGet("{seasonId}/reports/players/leaderboard")]
        [HttpGet("{seasonId}/reports/players/leadboard/{roundId}")]
        public async Task<IActionResult> GetPlayerLeaderboardReport(Guid seasonId, Guid? roundId, [FromQuery] int limit = 0)
        {
            var players = await _db.GetPlayerLeaderboardReport(seasonId, roundId);

            if (limit > 0)
                players = players.Take(limit);

            return Ok(players);
        }
    }
}
