﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public class Player : BaseEntity
    {
        public Guid SeasonId { get; set; }

        [ForeignKey("SeasonId")]
        public Season Season { get; set; }
        public string Name { get; set; }
        public int Cost { get; set; }
        [Column(TypeName = "numeric(18, 2)")]
        public decimal Multiplier { get; set; }
    }
}
