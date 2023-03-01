using DreamTeam.Data;
using DreamTeam.Models.LastStand;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace DreamTeam.Areas.Api.Public.ViewModels.LastStand
{
    public class RegisterViewModel : IValidatableObject
    {
        [Required]
        public Guid CompetitionId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public List<RoundResultType> Tips { get; set; }

        [Required]
        public string PaymentToken { get; set; }


        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var db = validationContext.GetRequiredService<ApplicationDbContext>();

            var comp = db.LastStandCompetitions.FirstOrDefault(x => x.Id == CompetitionId);

            if (comp == null)
                yield return new ValidationResult("Competition doesn't exist", new[] { "CompetitionId" });

            if (comp != null)
            {
                if (!comp.Active || comp.RegistrationEnds <= DateTimeOffset.Now)
                    yield return new ValidationResult("Competition is closed to new entires", new[] { "CompetitionId" });

                if (comp.Active && comp.RegistrationEnds > DateTimeOffset.Now) {
                    var rounds = db.LastStandRounds.Where(x => x.CompetitionId == CompetitionId).Count();

                    if (rounds != Tips.Count)
                        yield return new ValidationResult("Invalid number of tips", new[] { "Tips" });

                    if (Tips.Any(x => x != RoundResultType.HomeWins && x != RoundResultType.AwayWins))
                        yield return new ValidationResult("Invalid tips", new[] { "Tips" });
                }
            }

            yield break;
        }
    }
}
