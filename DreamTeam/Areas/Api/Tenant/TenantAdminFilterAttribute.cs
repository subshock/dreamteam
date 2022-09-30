using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using System;
using System.Linq;

namespace DreamTeam.Areas.Api.Tenant
{
    public class TenantAdminFilterAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var tenant = context.HttpContext.GetRouteValue("tenant") as string;
            var tenants = context.HttpContext.User.FindAll("tenant");

            if (!tenants.Any(x => string.Equals(x.Value, tenant, StringComparison.OrdinalIgnoreCase)))
                context.Result = new ForbidResult();
        }
    }
}
