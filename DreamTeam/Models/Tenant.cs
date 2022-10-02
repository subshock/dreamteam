using System.Collections.Generic;

namespace DreamTeam.Models
{
    public class Tenant : BaseEntity
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool Enabled { get; set; }
        public bool UsePaymentGateway { get; set; }
        public IEnumerable<TenantAdmin> Admins { get; set; }
    }
}
