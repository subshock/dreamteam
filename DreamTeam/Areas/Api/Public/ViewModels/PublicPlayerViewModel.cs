using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Public.ViewModels
{
    public class PublicPlayerViewModel : PointViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Cost { get; set; }
        public decimal Multiplier { get; set; }
        public int Points { get; set; }
    }
}
