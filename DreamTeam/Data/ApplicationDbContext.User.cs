using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task<List<ApplicationUser>> GetUsers()
        {
            return Users.OrderBy(x => x.Name).ToListAsync();
        }
    }
}
