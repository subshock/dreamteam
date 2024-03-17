using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models.LastStand
{
    public enum RoundResultType
    {
        NotPlayed = 0,
        HomeWins = 1,
        AwayWins = 2,
        Draw = 3
    }

    [Table("Round", Schema = "LastStand")]
    public class Round : BaseEntity
    {
        public Guid CompetitionId { get; set; }

        [ForeignKey("CompetitionId")]
        public Competition Competition { get; set; }

        public int Number { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public RoundResultType Result { get; set; }
    }

    public class RoundUpdateDto
    {
        public int? Number { get; set; }
        public string HomeTeam { get; set; }
        public string AwayTeam { get; set; }
        public RoundResultType? Result { get; set; }

        public bool HasUpdate => Number != null || HomeTeam != null || AwayTeam != null || Result != null;
    }
}
