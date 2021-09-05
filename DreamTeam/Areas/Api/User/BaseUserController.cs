using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.User
{
    [Authorize]
    public abstract class BaseUserController : BaseController
    {
        public string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
