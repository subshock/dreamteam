using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class TeamSummaryViewModel
    {
        public Guid Id { get; set; }
        public DateTimeOffset Updated { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string UserName { get; set; }
        public bool Valid { get; set; }
        public bool Paid { get; set; }
        public int Balance { get; set; }
    }

    public class TeamUpdateViewModel
    {
        public string Name { get; set; }
        public string Owner { get; set; }
    }
}
