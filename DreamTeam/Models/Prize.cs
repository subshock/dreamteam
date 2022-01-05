using System;

namespace DreamTeam.Models
{
    public class Prize : BaseEntity
    {
        public Guid SeasonId { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public int Position { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SortOrder { get; set; }
    }
}
