using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Models
{
    public enum TaskState
    {
        Running = 1,
        Completed = 2,
        Error = 3
    }

    [Index(nameof(TaskId), IsUnique = false)]
    public class TaskLog
    {
        [Key]
        public int Id { get; set; }

        public DateTimeOffset Timestamp { get; set; }

        public Guid TaskId { get; set; }

        public TaskState Status { get; set; }

        public string Title { get; set; }
        public string Message { get; set; }
        public int? Progress { get; set; }
    }
}
