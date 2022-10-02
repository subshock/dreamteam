using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace DreamTeam.Models
{
    public class TenantAdmin : BaseEntity
    {
        public Guid TenantId { get; set; }
        [ForeignKey("TenantId")]
        public Tenant Tenant { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }
}
