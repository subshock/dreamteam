using DreamTeam.Areas.Api.User.ViewModels;
using DreamTeam.Data;
using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class TeamManagementService
    {
        private readonly ApplicationDbContext _db;

        public TeamManagementService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<UserTeamUpdateResult> UpdateTeam(string userId, Guid teamId, UserTeamPlayersUpdateViewModel model)
        {
            if (model.Players.Count != Constants.PlayersPerTeam)
                return new UserTeamUpdateResult { Success = false, Error = "Wrong number of players" };

            if (!model.Players.Any(x => x == model.CaptainPlayerId))
                return new UserTeamUpdateResult { Success = false, Error = "Captain is not in team" };

            if (!model.Players.Any(x => x == model.ViceCaptainPlayerId))
                return new UserTeamUpdateResult { Success = false, Error = "Vice Captain is not in team" };

            var season = await _db.GetSeasonByTeam(teamId);

            if (season == null)
                return new UserTeamUpdateResult { Success = false, Error = "Season does not exist" };

            var tradePeriod = await _db.GetCurrentTradePeriod(season.Id);

            if (!(season.Status == SeasonStateType.Registration || (season.Status == SeasonStateType.Running && tradePeriod != null)))
                return new UserTeamUpdateResult { Success = false, Error = "Team cannot be changed" };

            var team = await _db.GetUserTeam(userId, teamId, tradePeriod?.Id);

            if (team == null)
                return new UserTeamUpdateResult { Success = false, Error = "Team does not exist" };

            var balance = team.Balance;
            List<Guid> removedPlayers = null;
            List<Guid> addedPlayers = null;

            if (tradePeriod?.Type == Areas.Api.Admin.ViewModels.TradePeriodType.TradePeriod)
            {
                // Check that the number of changes is within the limit
                var currentPlayers = team.Players.Where(x => !x.Added).Select(x => x.Id).ToList();
                var changes = Constants.PlayersPerTeam - model.Players.Where(x => currentPlayers.Contains(x)).Count();

                if (changes > tradePeriod.TradeLimit)
                    return new UserTeamUpdateResult { Success = false, Error = "Too many trades" };

                removedPlayers = currentPlayers.Where(x => !model.Players.Contains(x)).ToList();
                addedPlayers = model.Players.Where(x => !currentPlayers.Contains(x)).ToList();
            }
            else
            {
                removedPlayers = new List<Guid>();
                addedPlayers = model.Players;
            }

            var players = (await _db.GetPlayersAsync(model.Players)).ToList();

            if (players.Count != Constants.PlayersPerTeam)
                return new UserTeamUpdateResult { Success = false, Error = "Players do not exist" };

            if (players.Sum(x => x.Cost) > season.Budget)
                return new UserTeamUpdateResult { Success = false, Error = "Player cost is over the salary cap" };

            await _db.UpdateTeamPlayers(teamId, tradePeriod?.Type == Areas.Api.Admin.ViewModels.TradePeriodType.TradePeriod ? tradePeriod?.Id : null, 
                addedPlayers, removedPlayers, model.CaptainPlayerId, model.ViceCaptainPlayerId);

            return new UserTeamUpdateResult { Success = true };
        }
    }
}
