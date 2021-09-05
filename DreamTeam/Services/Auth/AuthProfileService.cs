using DreamTeam.Models;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DreamTeam.Services.Auth
{
    public class AuthProfileService : DefaultProfileService
    {
        protected readonly UserManager<ApplicationUser> _userManager;

        public AuthProfileService(UserManager<ApplicationUser> userManager, ILogger<AuthProfileService> logger) : base(logger)
        {
            _userManager = userManager;
        }

        public override async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            await base.GetProfileDataAsync(context);

            var user = await _userManager.GetUserAsync(context.Subject);

            context.IssuedClaims.Add(new Claim("name", user.Name ?? user.UserName));

            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);

                foreach (var role in roles)
                    context.IssuedClaims.Add(new Claim("role", role));
            }
        }

        //public async Task IsActiveAsync(IsActiveContext context)
        //{
        //    var user = await _userManager.GetUserAsync(context.Subject);

        //    context.IsActive = user != null;
        //}
    }
}
