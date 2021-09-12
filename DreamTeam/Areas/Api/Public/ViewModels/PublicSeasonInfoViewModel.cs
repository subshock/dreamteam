using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public.ViewModels
{
    public class PublicSeasonInfoViewModel : PointViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public SeasonStateType State { get; set; }
        public decimal Cost { get; set; }
        public int Budget { get; set; }
    }
}
