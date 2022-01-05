using System;

namespace DreamTeam.Areas.Api.Admin.ViewModels
{
    public class UpdatePrizeViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public int Position { get; set; }
    }
}
