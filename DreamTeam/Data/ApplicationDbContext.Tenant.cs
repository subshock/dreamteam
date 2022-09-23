using Dapper;
using DreamTeam.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext
    {
        public Task<List<Tenant>> GetAllTenants()
        {
            return Tenants.ToListAsync();
        }

        public Task<List<Tenant>> GetTenantsByUser(string userId)
        {
            return Tenants.Where(x => x.Admins.Any(x => x.UserId == userId)).ToListAsync();
        }

        public Task<Tenant> GetTenant(Guid id)
        {
            return Tenants.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<IEnumerable<TenantAdminViewModel>> GetTenantAdmins(string slug)
        {
            return Connection.QueryAsync<TenantAdminViewModel>("SELECT U.Id, U.Name, U.Username " +
                "FROM TenantAdmins AS A " +
                "   INNER JOIN Tenants AS T ON T.Id=A.TenantId " +
                "   INNER JOIN AspNetUsers AS U ON A.UserId=U.Id " +
                "WHERE T.Slug=@slug ORDER BY U.Name",
                new { slug });
        }

        public Task AddTenant(AddUpdateTenantModel obj)
        {
            return Connection.ExecuteAsync("INSERT INTO Tenants (Id, Name, Slug, Enabled, Created, Updated) VALUES (newid(), @Name, @Slug, @Enabled, @now, @now)",
                new
                {
                    obj.Name,
                    obj.Slug,
                    obj.Enabled,
                    now = DateTimeOffset.UtcNow
                });
        }

        public Task UpdateTenant(string slug, AddUpdateTenantModel obj)
        {
            return Connection.ExecuteAsync("UPDATE Tenants SET Name=@Name, Slug=@Slug, Enabled=@Enabled, Updated=@now WHERE Slug=@currentSlug",
                new { currentSlug = slug, obj.Slug, obj.Name, obj.Enabled, now = DateTimeOffset.UtcNow });
        }

        public Task AddTenantAdmin(string slug, Guid userId)
        {
            return Connection.ExecuteAsync("DECLARE @tenantId uniqueidentifier; " +
                "SELECT TOP(1) @tenantId=Id FROM Tenants WHERE Slug=@slug; " +
                "IF @tenantId Is Not null AND NOT EXISTS(SELECT 1 FROM TenantAdmins WHERE UserId=@userId AND TenantId=@tenantId)" +
                "    INSERT INTO TenantAdmins (Id, TenantId, UserId, Created, Updated) VALUES (newid(), @tenantId, @userId, @now, @now)",
                new { slug, userId, now = DateTimeOffset.UtcNow });
        }

        public Task RemoveTenantAdmin(string slug, Guid userId)
        {
            return Connection.ExecuteAsync("DELETE FROM TenantAdmins WHERE UserId=@userId AND TenantId=(SELECT Id FROM Tenants WHERE Slug=@slug)",
                new { slug, userId });
        }
    }

    public class TenantAdminViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
    }

    public class AddUpdateTenantModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public bool Enabled { get; set; }
    }
}
