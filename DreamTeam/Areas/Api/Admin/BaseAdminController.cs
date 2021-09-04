using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Authorize(Policy = "Administrator")]
    public class BaseAdminController : BaseController
    {
    }
}
