﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models
{
    public class Season : BaseEntity, IPointDefinition
    {
        public Guid TenantId { get; set; }
        [ForeignKey("TenantId")]
        public Tenant Tenant { get; set; }
        public string Name { get; set; }
        public SeasonStateType Status { get; set; }
        public int Budget { get; set; }

        [Column(TypeName = "money")]
        public decimal Cost { get; set; }

        public int Runs { get; set; }
        public int UnassistedWickets { get; set; }
        public int AssistedWickets { get; set; }
        public int Catches { get; set; }
        public int Runouts { get; set; }
        public int Stumpings { get; set; }

        public int MaxPlayers { get; set; }
        public int ScoringPlayers { get; set; }

        public DateTimeOffset? RegistrationEndDate { get; set; }


        [NotMapped]
        public static Dictionary<SeasonStateType, List<SeasonStateType>> SeasonWorkflow = new Dictionary<SeasonStateType, List<SeasonStateType>>
        {
            [SeasonStateType.Setup] = new List<SeasonStateType> { SeasonStateType.Registration, SeasonStateType.Finished },
            [SeasonStateType.Registration] = new List<SeasonStateType> { SeasonStateType.Setup, SeasonStateType.Running },
            [SeasonStateType.Running] = new List<SeasonStateType> { SeasonStateType.Finished },
            [SeasonStateType.Finished] = new List<SeasonStateType> { SeasonStateType.Archived },
            [SeasonStateType.Archived] = new List<SeasonStateType>()
        };

}
}
