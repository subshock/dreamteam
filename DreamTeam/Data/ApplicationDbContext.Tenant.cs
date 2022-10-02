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

        public Task<Tenant> GetTenantBySlug(string slug)
        {
            return Tenants.FirstOrDefaultAsync(x => x.Slug == slug);
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
            return Connection.ExecuteAsync("INSERT INTO Tenants (Id, Name, Slug, UsePaymentGateway, Enabled, Created, Updated) VALUES (newid(), @Name, @Slug, @UsePaymentGateway, @Enabled, @now, @now)",
                new
                {
                    obj.Name,
                    obj.Slug,
                    obj.UsePaymentGateway,
                    obj.Enabled,
                    now = DateTimeOffset.UtcNow
                });
        }

        public Task UpdateTenant(string slug, AddUpdateTenantModel obj)
        {
            return Connection.ExecuteAsync("UPDATE Tenants SET Name=@Name, Slug=@Slug, UsePaymentGateway=@UsePaymentGateway, Enabled=@Enabled, Updated=@now WHERE Slug=@currentSlug",
                new { currentSlug = slug, obj.Slug, obj.Name, obj.UsePaymentGateway, obj.Enabled, now = DateTimeOffset.UtcNow });
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

        public async Task<IEnumerable<TenantSeasonViewModel>> GetTenantSeasons(string slug, bool excludeSetupStatus)
        {
            var items = await Connection.QueryAsync<TenantSeasonDbo>("SELECT T.Slug, T.Name AS TenantName, S.Id as SeasonId, S.Name AS SeasonName, " +
                "   S.Status, S.Cost, S.RegistrationEndDate " +
                "FROM Tenants AS T " +
                "   LEFT OUTER JOIN Seasons AS S ON T.Id=S.TenantId AND (@excludeSetupStatus Is Null OR S.Status > @setupStatus) " +
                "WHERE T.Enabled=1 AND (@slug Is Null OR T.Slug=@slug) " +
                "ORDER BY T.Name DESC, S.Status ASC", new { slug, excludeSetupStatus, setupStatus = (int)SeasonStateType.Setup });

            return items.GroupBy(x => new { x.Slug, x.TenantName })
                .Select(x => new TenantSeasonViewModel
                {
                    Slug = x.Key.Slug,
                    Name = x.Key.TenantName,
                    Seasons = x.Where(s => s.SeasonId != Guid.Empty).Select(s => new TenantSeasonViewModel.Season
                    {
                        Id = s.SeasonId,
                        Name = s.SeasonName,
                        Status = s.Status,
                        Cost = s.Cost,
                        RegistrationEndDate = s.RegistrationEndDate,
                    }).ToList()
                }).ToList();
        }
    }

    internal class TenantSeasonDbo
    {
        public string Slug { get; set; }
        public string TenantName { get; set; }
        public Guid SeasonId { get; set; }
        public string SeasonName { get; set; }
        public SeasonStateType Status { get; set; }
        public decimal Cost { get; set; }
        public DateTimeOffset? RegistrationEndDate { get; set; }
    }

    public class TenantSeasonViewModel
    {
        public string Slug { get; set; }
        public string Name { get; set; }
        public List<Season> Seasons { get; set; }

        public class Season
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public SeasonStateType Status { get; set; }
            public decimal Cost { get; set; }
            public DateTimeOffset? RegistrationEndDate { get; set; }
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
        public bool UsePaymentGateway { get; set; }
        public bool Enabled { get; set; }
    }
}
