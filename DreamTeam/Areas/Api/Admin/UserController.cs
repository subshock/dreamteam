using DreamTeam.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    [Authorize(Policy = "SysAdmin")]
    public class UserController : BaseAdminController
    {
        private readonly ApplicationDbContext _db;

        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            return Ok((await _db.GetUsers()).Select(x => new
            {
                x.Id,
                x.Name,
                x.Email,
                x.UserName
            }));
        }
    }
}
