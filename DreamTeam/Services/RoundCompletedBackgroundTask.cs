using DreamTeam.Data;
using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class RoundCompletedBackgroundTask
    {
        public static readonly string TaskTitle = "Completing Round";

        private readonly ApplicationDbContext _db;
        private readonly TaskLogService _log;
        private readonly ILogger _logger;

        public RoundCompletedBackgroundTask(ApplicationDbContext db, TaskLogService log, ILogger<RoundCompletedBackgroundTask> logger)
        {
            _db = db;
            _log = log;
            _logger = logger;
        }

        private RoundPlayer _emptyPlayer = new RoundPlayer();

        public async Task Run(Guid taskId, Guid roundId)
        {
            try
            {
                var round = await _db.Rounds.FindAsync(roundId);

                if (round == null)
                {
                    await _log.LogError(taskId, TaskTitle, "Round does not exist");
                    return;
                }

                await _db.UpdateRoundStatus(round.Id, RoundStateType.Calculating);

                var season = await _db.Seasons.FindAsync(round.SeasonId);
                var teams = await _db.Teams.Where(x => x.SeasonId == season.Id && x.Valid).ToListAsync();
                var roundPlayers = await _db.RoundPlayers.Where(x => x.RoundId == round.Id).ToListAsync();

                // Delete any existing results for this round if we've marked this as completed multiple times
                await _db.DeleteTeamRoundResults(roundId);
                await _log.LogMessage(taskId, TaskTitle, "Deleted any existing results for this round.");

                var teamCount = 0;
                var now = DateTime.UtcNow;

                await _log.LogMessage(taskId, TaskTitle, "Calculating results for all teams.");

                foreach (var team in teams)
                {
                    var teamPlayers = (await _db.GetTeamPlayersForRound(team.Id, roundId)).ToDictionary(k => k.PlayerId);
                    var captains = await _db.GetTeamCaptainsForRound(team.Id, roundId) ?? new TeamCaptain();
                    var captainPlayed = roundPlayers.Any(x => x.PlayerId == captains.CaptainId);

                    var captainId = captainPlayed ? captains.CaptainId : captains.ViceCaptainId;

                    var teamResult = roundPlayers
                        .Where(x => teamPlayers.ContainsKey(x.PlayerId))
                        .DefaultIfEmpty(_emptyPlayer)
                        .Select(x => new
                        {
                            x.PlayerId,
                            x.Runs,
                            x.UnassistedWickets,
                            x.AssistedWickets,
                            x.Catches,
                            x.Runouts,
                            x.Stumpings,
                            Points = x.Points * (x.PlayerId == captainId ? 2 : 1)
                        })
                        .OrderByDescending(x => x.Points)
                        .Take(season.ScoringPlayers)
                        .Aggregate(new TeamRoundResult { Id = Guid.NewGuid(), TeamId = team.Id, Created = now, RoundId = round.Id }, (acc, curr) =>
                        {
                            acc.Runs += curr.Runs;
                            acc.UnassistedWickets += curr.UnassistedWickets;
                            acc.AssistedWickets += curr.AssistedWickets;
                            acc.Catches += curr.Catches;
                            acc.Runouts += curr.Runouts;
                            acc.Stumpings += curr.Stumpings;
                            acc.Points += curr.Points;

                            return acc;
                        });

                    _db.TeamRoundResults.Add(teamResult);
                    await _db.SaveChangesAsync();

                    teamCount++;
                    await _log.LogMessage(taskId, TaskTitle, $"Calculated results for team: '{team.Name}' - {teamResult.Points} points.", 
                        teamCount * 100 / teams.Count);
                }

                await _log.LogMessage(taskId, TaskTitle, "Calculating ranks.");
                await _db.CreateRankingsForRound(roundId);

                await _db.UpdateRoundStatus(roundId, RoundStateType.Completed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing round");
                await _log.LogError(taskId, TaskTitle, "There was an error completing the round");
            }
            finally
            {
                await _log.LogCompleted(taskId, TaskTitle);
            }
        }
    }
}
