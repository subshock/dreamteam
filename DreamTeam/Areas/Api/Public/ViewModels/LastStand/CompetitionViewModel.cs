using DreamTeam.Models.LastStand;
using System;
using System.Collections.Generic;

namespace DreamTeam.Areas.Api.Public.ViewModels.LastStand
{
    public class CompetitionViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Cost { get; set; }
        public DateTimeOffset RegistrationEnds { get; set; }
        public bool RegistrationOpen => RegistrationEnds > DateTimeOffset.Now;
        public List<Round> Rounds { get; set; }
        public List<Entry> Entries { get; set; }

        public class Round
        {
            public string HomeTeam { get; set; }
            public string AwayTeam { get; set; }
            public RoundResultType Result { get; set; }
        }

        public class Entry
        {
            public string Name { get; set; }
            public List<RoundResultType> Tips { get; set; }
        }
    }
}
