using DreamTeam.Data;
using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class TaskLogService
    {
        private readonly ApplicationDbContext _db;

        public TaskLogService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<Guid> StartTaskLog(string title)
        {
            var taskId = Guid.NewGuid();

            await LogMessage(taskId, title, "Starting");

            return taskId;
        }

        public Task<List<TaskLog>> GetMessagesSince(Guid taskId, int? lastId)
        {
            return _db.TaskLogs.Where(x => x.TaskId == taskId && (lastId == null || x.Id > lastId)).OrderBy(x => x.Id).ToListAsync();
        }
        
        public Task LogMessage(Guid taskId, string title, string message, int? progress = null)
        {
            return Log(taskId, title, message, TaskState.Running, progress);
        }

        public Task LogError(Guid taskId, string title, string message, int? progress = null)
        {
            return Log(taskId, title, message, TaskState.Error, progress);
        }

        public Task LogCompleted(Guid taskId, string title)
        {
            return Log(taskId, title, "Completed", TaskState.Completed, 100);
        }

        private Task Log(Guid taskId, string title, string message, TaskState status, int? progress)
        {
            var log = new TaskLog
            {
                TaskId = taskId,
                Title = title,
                Message = message,
                Progress = progress,
                Timestamp = DateTime.UtcNow,
                Status = status
            };

            _db.TaskLogs.Add(log);

            return _db.SaveChangesAsync();
        }
    }
}
