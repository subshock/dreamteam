using DreamTeam.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Data
{
    public partial class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>, IDataProtectionKeyContext
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbConnection Connection {
            get {
                var conn = Database.GetDbConnection();

                if (conn.State != System.Data.ConnectionState.Open)
                    conn.Open();

                return conn;
            }
        }

        public DbSet<Season> Seasons { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Round> Rounds { get; set; }
        public DbSet<RoundPlayer> RoundPlayers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<TeamPlayer> TeamPlayers { get; set; }
        public DbSet<TeamCaptain> TeamCaptains { get; set; }
        public DbSet<TradePeriod> TradePeriods { get; set; }
        public DbSet<TeamRoundResult> TeamRoundResults { get; set; }
        public DbSet<TeamRoundRank> TeamRoundRanks { get; set; }
        public DbSet<TaskLog> TaskLogs { get; set; }
        public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
    }
}
