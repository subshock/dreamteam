using DreamTeam.Models;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DreamTeam.Services.Auth
{
    public class AuthProfileService : IProfileService
    {
        protected readonly UserManager<ApplicationUser> _userManager;

        public AuthProfileService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);

            context.IssuedClaims.Add(new Claim("name", user.UserName));

            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);

                foreach (var role in roles)
                    context.IssuedClaims.Add(new Claim("role", role));
            }
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var user = await _userManager.GetUserAsync(context.Subject);

            context.IsActive = user != null;
        }
    }
}
