using Microsoft.AspNetCore.Authorization;

namespace DreamTeam.Areas.Api.User
{
    [Authorize]
    public abstract class BaseUserController : BaseController
    {
    }
}
