using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DreamTeam.Areas.Api.Tenant
{
    [Authorize]
    [TenantAdminFilter]
    public abstract class BaseTenantController : Controller
    {
    }
}
