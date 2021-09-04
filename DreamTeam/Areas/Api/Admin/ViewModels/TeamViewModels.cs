using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class TeamSummaryViewModel
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public bool Valid { get; set; }
        public int Balance { get; set; }
    }

    public class TeamUpdateViewModel
    {
        public string Name { get; set; }
        public string Owner { get; set; }
    }
}
