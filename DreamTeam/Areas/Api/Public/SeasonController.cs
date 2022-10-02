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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSeason(Guid id)
        {
            var obj = await _db.PublicGetSeasonInfo(id);

            if (obj == null)
                return NotFound();

            return Ok(obj);
        }

        [HttpGet("{seasonId:guid}/content/{name}")]
        public async Task<IActionResult> GetSeasonContent(Guid seasonId, string name)
        {
            var obj = await _db.SeasonContents.FirstOrDefaultAsync(x => x.SeasonId == seasonId && x.Name == name);

            return Ok(new
            {
                Name = obj?.Name ?? name,
                Content = obj?.Content ?? ""
            });
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

        [HttpGet("{seasonId:guid}/rounds/{roundId:guid}")]
        public async Task<IActionResult> GetCompletedRound(Guid seasonId, Guid roundId)
        {
            var round = await _db.Rounds.Where(x => x.SeasonId == seasonId && x.Id == roundId && x.Status == RoundStateType.Completed).FirstOrDefaultAsync();

            if (round == null)
                return NotFound();

            return Ok(round);
        }

        [HttpGet("{seasonId:guid}/reports/teams/leaderboard")]
        [HttpGet("{seasonId:guid}/reports/teams/leaderboard/{roundId:guid}")]
        public async Task<IActionResult> GetTeamLeaderboardReport(Guid seasonId, Guid? roundId, [FromQuery] int limit = 0)
        {
            var teams = await _db.GetTeamLeaderboardReport(seasonId, roundId);

            if (limit > 0)
                teams = teams.Take(limit);

            return Ok(teams);
        }

        [HttpGet("{seasonId:guid}/reports/players/leaderboard")]
        [HttpGet("{seasonId:guid}/reports/players/leaderboard/{roundId:guid}")]
        public async Task<IActionResult> GetPlayerLeaderboardReport(Guid seasonId, Guid? roundId, [FromQuery] int limit = 0)
        {
            var players = await _db.GetPlayerLeaderboardReport(seasonId, roundId);

            if (limit > 0)
                players = players.Take(limit);

            return Ok(players);
        }

        [HttpGet("{seasonId:guid}/reports/player/{playerId:guid}")]
        public async Task<IActionResult> GetPlayerReport(Guid seasonId, Guid playerId)
        {
            return Ok(await _db.GetPlayerReport(seasonId, playerId));
        }

        [HttpGet("{seasonId:guid}/reports/team/{teamId:guid}")]
        public async Task<IActionResult> GetTeamReport(Guid seasonId, Guid teamId)
        {
            return Ok(await _db.GetTeamReport(seasonId, teamId));
        }

        [HttpGet("{seasonId:guid}/reports/prizes")]
        public async Task<IActionResult> GetPrizeReport(Guid seasonId)
        {
            return Ok(await _db.GetPrizeReport(seasonId));
        }
    }
}
