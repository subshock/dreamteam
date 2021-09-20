using DreamTeam.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.User.ViewModels
{
    public class UserTeamViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTimeOffset Updated { get; set; }
        public string Owner { get; set; }
        public bool Valid { get; set; }
        public int Balance { get; set; }
        public bool Paid { get; set; }

        public ICollection<UserTeamPlayerViewModel> Players { get; set; }
    }

    public class UserTeamPlayerViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public decimal Multiplier { get; set; }
        public TeamPlayerType Type { get; set; }
        public bool Added { get; set; }
        public bool Removed { get; set; }
        public int Cost { get; set; }
        public int Points { get; set; }
    }

    public class UserTeamPlayersUpdateViewModel
    {
        private List<Guid> _players = null;
        [Required]
        public Guid CaptainPlayerId { get; set; }
        [Required]
        public Guid ViceCaptainPlayerId { get; set; }

        [Required]
        public List<Guid> Players
        {
            get => _players = _players ?? new List<Guid>();
            set => _players = value;
        }
    }

    public class UserTeamUpdateResult
    {
        public bool Success { get; set; }
        public string Error { get; set; }
    }
}
