using Dapper;
using DreamTeam.Areas.Api.Public.ViewModels.LastStand;
using DreamTeam.Models.LastStand;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task LastStandRegisterEntry(RegisterViewModel model, string token)
        {
            var now = DateTimeOffset.Now;

            var entry = new Entry
            {
                Id = Guid.NewGuid(),
                Created = now,
                Active = true,
                CompetitionId = model.CompetitionId,
                Email = model.Email,
                Name = model.Name,
                TransactionId = token
            };

            LastStandEntries.Add(entry);

            var roundNumber = 0;
            foreach (var tip in model.Tips)
            {
                roundNumber++;
                LastStandEntryRounds.Add(new EntryRound
                {
                    Id = Guid.NewGuid(),
                    Number = roundNumber,
                    EntryId = entry.Id,
                    Created = now,
                    Tip = tip
                });
            }

            return SaveChangesAsync();
        }

        public async Task<CompetitionViewModel> LastStandGetActiveCompetition()
        {
            var sql = @"DECLARE @id uniqueidentifier
SELECT TOP(1) @id=Id FROM LastStand.Competition WHERE Active=1 ORDER BY RegistrationEnds DESC;

SELECT Id, Name, RegistrationEnds, Cost FROM LastStand.Competition WHERE Id=@id;

IF @id Is Not Null
BEGIN
	SELECT HomeTeam, AwayTeam, Result FROM LastStand.[Round] WHERE CompetitionId=@id ORDER BY Number;
	SELECT E.Id, E.Name, T.Tip FROM LastStand.[Entry] AS E
		LEFT OUTER JOIN LastStand.EntryRound AS T ON E.Id=T.EntryId
        INNER JOIN LastStand.Competition AS C ON C.Id=E.CompetitionId
	WHERE E.CompetitionId=@id AND E.Active=1 AND C.RegistrationEnds < SYSDATETIMEOFFSET()
	ORDER BY E.Name, T.Number
END
";
            using (var rdr = await Connection.QueryMultipleAsync(sql))
            {
                var comp = await rdr.ReadFirstOrDefaultAsync<CompetitionViewModel>();

                if (comp == null)
                    return null;

                comp.Rounds = (await rdr.ReadAsync<CompetitionViewModel.Round>()).ToList();
                comp.Entries = (await rdr.ReadAsync<LastStandEntryDbo>()).GroupBy(x => new { x.Id, x.Name })
                    .Select(x => new CompetitionViewModel.Entry
                    {
                        Name = x.Key.Name,
                        Tips = x.Select(t => t.Tip).ToList()
                    }).ToList();

                return comp;
            }
        }

        public class LastStandEntryDbo
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public RoundResultType Tip { get; set; }
        }
    }
}
