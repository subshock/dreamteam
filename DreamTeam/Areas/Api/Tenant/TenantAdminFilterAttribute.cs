using DreamTeam.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public class TenantAdminFilterAttribute : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var tenant = context.HttpContext.GetRouteValue("tenant") as string;
            var tenants = context.HttpContext.User.FindAll("tenant");

            if (!tenants.Any(x => string.Equals(x.Value, tenant, StringComparison.OrdinalIgnoreCase)))
                context.Result = new ForbidResult();

            var seasonValue = context.HttpContext.GetRouteValue("seasonId") as string;

            // if we have a season id, ensure that it is within this tenant
            if (seasonValue != null && Guid.TryParse(seasonValue, out var seasonId))
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<ApplicationDbContext>();

                if (!await db.IsSeasonInTenant(seasonId, tenant))
                    context.Result = new ForbidResult();
            }
        }
    }
}
