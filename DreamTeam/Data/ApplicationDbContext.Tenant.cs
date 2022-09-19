using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task<List<Tenant>> GetAllTenants()
        {
            return Tenants.ToListAsync();
        }

        public Task<List<Tenant>> GetTenantsByUser(string userId)
        {
            return Tenants.Where(x => x.Admins.Any(x => x.UserId == userId)).ToListAsync();
        }
    }
}
