using Dapper;
using DreamTeam.Areas.Api;
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
        #region Season operations

        public Task<IEnumerable<SeasonSummaryViewModel>> GetSeasonsAsync()
        {
            return Connection.QueryAsync<SeasonSummaryViewModel>("SELECT Id, Status, Created, Updated, Name, RegistrationEndDate FROM Seasons ORDER BY Created DESC");
        }

        public async Task<SeasonViewModel> GetSeasonAsync(Guid id)
        {
            var obj = await Connection.QueryFirstOrDefaultAsync<SeasonViewDbo>(@"
                SELECT S.Id, S.Name, S.Budget, S.Created, S.Updated, S.Cost, S.Status,
                    S.Runs, S.UnassistedWickets, S.AssistedWickets, S.Catches, S.Runouts, S.Stumpings,
                    (SELECT COUNT(*) FROM Players WHERE SeasonId=S.Id) AS Players,
                    (SELECT COUNT(*) FROM Teams WHERE SeasonId=S.Id) AS Teams,
                    (SELECT COUNT(*) FROM Rounds WHERE SeasonId=S.Id) AS Rounds,
                    (SELECT COUNT(*) FROM TradePeriods WHERE SeasonId=S.Id) AS TradePeriods,
                    (SELECT COUNT(*) FROM Prizes WHERE SeasonId=S.Id) AS Prizes,
                    S.RegistrationEndDate
                FROM Seasons AS S
                WHERE S.Id=@id
                ", new { id });

            return obj?.ToDto();
        }

        public async Task<Season> GetSeasonByTeam(Guid teamId)
        {
            return await Connection.QueryFirstOrDefaultAsync<Season>("SELECT S.* FROM Seasons AS S INNER JOIN Teams AS T ON S.Id=T.SeasonId WHERE T.Id=@teamId", 
                new { teamId });
        }

        public async Task<Season> CreateSeasonAsync(UpdateSeasonViewModel model)
        {
            var season = new Season()
            {
                Id = Guid.NewGuid(),
                Status = SeasonStateType.Setup,
                Name = model.Name,
                Cost = model.Cost,
                Budget = model.Budget,
                Created = DateTime.UtcNow,
                Catches = model.PointDefinition.Catches,
                Runouts = model.PointDefinition.Runouts,
                Runs = model.PointDefinition.Runs,
                Stumpings = model.PointDefinition.Stumpings,
                AssistedWickets = model.PointDefinition.AssistedWickets,
                UnassistedWickets = model.PointDefinition.UnassistedWickets,
                RegistrationEndDate = model.RegistrationEndDate
            };

            Seasons.Add(season);

            await SaveChangesAsync();

            return season;
        }

        public Task UpdateSeasonAsync(Guid id, UpdateSeasonViewModel model)
        {
            var season = Seasons.FirstOrDefault(x => x.Id == id);

            if (season == null)
                return Task.CompletedTask;

            season.Updated = DateTime.UtcNow;
            season.Name = model.Name;
            season.Budget = model.Budget;
            season.Cost = model.Cost;
            season.Catches = model.PointDefinition.Catches;
            season.Runouts = model.PointDefinition.Runouts;
            season.Runs = model.PointDefinition.Runs;
            season.Stumpings = model.PointDefinition.Stumpings;
            season.AssistedWickets = model.PointDefinition.AssistedWickets;
            season.UnassistedWickets = model.PointDefinition.UnassistedWickets;
            season.RegistrationEndDate = model.RegistrationEndDate;

            Seasons.Update(season);

            return SaveChangesAsync();
        }

        public async Task<bool> UpdateSeasonStatusAsync(Guid id, SeasonStateType newStatus)
        {
            var season = Seasons.FirstOrDefault(x => x.Id == id);

            if (season == null)
                return false;

            // Either the season status is invalid or the new status requested is
            if (!Season.SeasonWorkflow.ContainsKey(season.Status) || !Season.SeasonWorkflow.ContainsKey(newStatus))
                return false;

            // Can't transition from the current status to the requested status
            if (!Season.SeasonWorkflow[season.Status].Contains(newStatus))
                return false;

            season.Status = newStatus;
            season.Updated = DateTime.UtcNow;

            Seasons.Update(season);

            return await SaveChangesAsync() > 0;
        }

        public Task DeleteSeasonAsync(Guid id)
        {
            return Connection.ExecuteAsync("DELETE FROM Seasons WHERE Id=@id", new { id });
        }

        public async Task<bool> CanAddTeamsToSeasonAsync(Guid id)
        {
            var seasonStatus = await Connection.ExecuteScalarAsync<SeasonStateType>("SELECT Status FROM Seasons WHERE Id=@id", new { id });

            return seasonStatus == SeasonStateType.Registration;
        }

        public bool CanAddTeamsToSeason(SeasonStateType status, DateTimeOffset? registrationEndDate)
        {
            return status == SeasonStateType.Registration && (registrationEndDate == null || registrationEndDate > DateTimeOffset.Now);
        }

        public class SeasonViewDbo : Season
        {
            public int Players { get; set; }
            public int Teams { get; set; }
            public int Rounds { get; set; }
            public int TradePeriods { get; set; }
            public int Prizes { get; set; }

            public SeasonViewModel ToDto()
            {
                return new SeasonViewModel
                {
                    Id = Id,
                    Name = Name,
                    Budget = Budget,
                    Cost = Cost,
                    Created = Created,
                    Updated = Updated,
                    Players = Players,
                    Teams = Teams,
                    Prizes = Prizes,
                    Rounds = Rounds,
                    Status = Status,
                    TradePeriods = TradePeriods,
                    PointDefinition = new PointViewModel
                    {
                        Runs = Runs,
                        UnassistedWickets = UnassistedWickets,
                        AssistedWickets = AssistedWickets,
                        Catches = Catches,
                        Runouts = Runouts,
                        Stumpings = Stumpings
                    },
                    RegistrationEndDate = RegistrationEndDate
                };
            }
        }

        #endregion
    }
}
