using Dapper;
using DreamTeam.Areas.Api.Admin.ViewModels;
using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        #region Rounds

        public Task<IEnumerable<RoundSummaryViewModel>> GetRounds(Guid seasonId)
        {
            return Connection.QueryAsync<RoundSummaryViewModel>("SELECT R.Id, R.Name, R.StartDate, R.EndDate, R.Completed, COUNT(P.Id) AS Players " +
                "FROM Rounds AS R LEFT OUTER JOIN RoundPlayers AS P ON R.Id=P.RoundId " +
                "WHERE R.SeasonId=@seasonId " +
                "GROUP BY R.Id, R.Name, R.StartDate, R.EndDate, R.Completed " +
                "ORDER BY R.Name", new { seasonId });
        }

        public Task<RoundViewModel> GetRound(Guid seasonId, Guid roundId)
        {
            return Connection.QueryFirstOrDefaultAsync<RoundViewModel>("SELECT Id, Name, Created, Updated, Completed, StartDate, EndDate " +
                "FROM Rounds WHERE SeasonId=@seasonId AND Id=@roundId", new { seasonId, roundId });
        }

        public Task<Guid> AddRound(Guid seasonId, RoundUpdateViewModel model)
        {
            var round = new Round
            {
                Id = Guid.NewGuid(),
                SeasonId = seasonId,
                Created = DateTime.UtcNow,
                Completed = false,
                Name = model.Name,
                StartDate = model.StartDate,
                EndDate = model.EndDate
            };

            Rounds.Add(round);

            return SaveChangesAsync().ContinueWith(_ => round.Id);
        }

        public Task UpdateRound(Guid seasonId, Guid roundId, RoundUpdateViewModel model)
        {
            return Connection.ExecuteAsync("UPDATE Rounds SET Name=@Name, StartDate=@StartDate, EndDate=@EndDate, Updated=@now " +
                "WHERE SeasonId=@seasonId AND Id=@roundId",
                new
                {
                    model.Name,
                    model.StartDate,
                    model.EndDate,
                    now = DateTime.UtcNow,
                    seasonId,
                    roundId
                });
        }

        public async Task DeleteRound(Guid seasonId, Guid roundId)
        {
            using (var tran = Connection.BeginTransaction())
            {
                await Connection.ExecuteAsync("DELETE FROM RoundPlayers WHERE RoundId=@roundId", new { roundId }, tran);
                await Connection.ExecuteAsync("DELETE FROM Rounds WHERE SeasonId=@seasonId AND Id=@roundId", new { seasonId, roundId }, tran);

                await tran.CommitAsync();
            }
        }

        public Task<IEnumerable<RoundPlayerViewModel>> GetRoundPlayers(Guid seasonId, Guid roundId)
        {
            return Connection.QueryAsync<RoundPlayerDbo>("SELECT RP.Id, RP.PlayerId, P.Name, P.Multiplier, RP.Runs, RP.AssistedWickets, " +
                "RP.UnassistedWickets, RP.Catches, RP.Runouts, RP.Stumpings AS [Points.Stumpings] " +
                "FROM RoundPlayers AS RP " +
                "   INNER JOIN Players AS P ON RP.PlayerId=P.Id " +
                "   INNER JOIN Rounds AS R ON RP.RoundId=R.Id " +
                "WHERE R.SeasonId=@seasonId AND R.Id=@roundId " +
                "ORDER BY P.Name ASC", new { seasonId, roundId })
                .ContinueWith(task => task.Result.Select(x => x.ToDto()));
        }

        public Task AddPlayerToRound(Guid seasonId, Guid roundId, RoundPlayerUpdateViewModel model)
        {
            var player = new RoundPlayer
            {
                Id = Guid.NewGuid(),
                RoundId = roundId,
                PlayerId = model.PlayerId,
                Runs = model.Points.Runs,
                UnassistedWickets = model.Points.UnassistedWickets,
                AssistedWickets = model.Points.AssistedWickets,
                Catches = model.Points.Catches,
                Runouts = model.Points.Runouts,
                Stumpings = model.Points.Stumpings,
                Created = DateTime.UtcNow
            };

            RoundPlayers.Add(player);

            return SaveChangesAsync();
        }

        public Task UpdatePlayerInRound(Guid seasonId, Guid roundId, Guid id, RoundPlayerUpdateViewModel model)
        {
            return Connection.ExecuteAsync("UPDATE RoundPlayers SET Runs=@Runs, UnassistedWickets=@UnassistedWickets, AssistedWickets=@AssistedWickets, " +
                "Catches=@Catches, Runouts=@Runouts, Stumpings=@Stumpings, Updated=@now " +
                "WHERE RoundId=@roundId AND Id=@id AND PlayerId=@PlayerId",
                new
                {
                    roundId,
                    id,
                    model.PlayerId,
                    model.Points.Runs,
                    model.Points.UnassistedWickets,
                    model.Points.AssistedWickets,
                    model.Points.Catches,
                    model.Points.Runouts,
                    model.Points.Stumpings,
                    now = DateTime.UtcNow
                });
        }

        public Task DeletePlayerFromRound(Guid seasonId, Guid roundId, Guid id)
        {
            return Connection.ExecuteAsync("DELETE FROM RoundPlayers WHERE RoundId=@roundId AND Id=@id", new { roundId, id });
        }

        public class RoundPlayerDbo : PointViewModel
        {
            public Guid Id { get; set; }
            public Guid PlayerId { get; set; }
            public string Name { get; set; }
            public decimal Multiplier { get; set; }
            public int Total { get; set; }

            public RoundPlayerViewModel ToDto()
            {
                return new RoundPlayerViewModel
                {
                    Id = Id,
                    Multiplier = Multiplier,
                    Name = Name,
                    PlayerId = PlayerId,
                    Total = Total,
                    Points = new PointViewModel
                    {
                        Runs = Runs,
                        AssistedWickets = AssistedWickets,
                        Catches = Catches,
                        Runouts = Runouts,
                        Stumpings = Stumpings,
                        UnassistedWickets = UnassistedWickets
                    }
                };
            }
        }

        #endregion
    }
}
