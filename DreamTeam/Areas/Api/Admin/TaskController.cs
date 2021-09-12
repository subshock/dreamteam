using DreamTeam.Data;
using DreamTeam.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Admin
{
    [Route("api/admin/[controller]")]
    public class TaskController : BaseAdminController
    {
        private readonly TaskLogService _log;

        public TaskController(TaskLogService log)
        {
            _log = log;
        }

        [HttpGet("{token:Guid}")]
        public async Task<IActionResult> GetTaskLogs(Guid token, [FromQuery] int? from)
        {
            return Ok(await _log.GetMessagesSince(token, from));
        }
    }
}
