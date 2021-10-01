using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;

namespace GenerateRound
{
    class Program
    {
        static void Main(string[] args)
        {
            var host = Host.CreateDefaultBuilder().Build();

            var config = host.Services.GetRequiredService<IConfiguration>();

            using (var conn = new SqlConnection(config.GetConnectionString("DefaultConnection")))
            {
                conn.Open();

                var season = conn.QuerySingle<SeasonInfo>("SELECT Id, Name, Runs, UnassistedWickets, AssistedWickets, Catches, Runouts, Stumpings From Seasons");
                var rounds = conn.Query<RoundInfo>("SELECT Id, Name, Status FROM Rounds").ToList();
                var players = conn.Query<PlayerInfo>("SELECT Id, Multiplier FROM Players").ToList();

                Console.WriteLine($"Season: {season.Name}");
                Console.WriteLine($"Rounds: {rounds.Count}, Players: {players.Count}");
                var rnd = new Random();

                foreach (var round in rounds) {
                    using (var tran = conn.BeginTransaction())
                    {
                        Console.WriteLine($"Round: {round.Name}");
                        conn.Execute("UPDATE Rounds SET Status=0 WHERE Id=@Id", round, tran);
                        conn.Execute("DELETE FROM RoundPlayers WHERE RoundId=@Id", round, tran);

                        foreach (var player in players)
                            conn.Execute("INSERT INTO RoundPlayers (Id, RoundId, PlayerId, Runs, UnassistedWickets, AssistedWickets, Catches, Runouts, Stumpings, Points, Created) VALUES (NEWID(), @RoundId, @PlayerId, @Runs, @UnassistedWickets, @AssistedWickets, @Catches, @Runouts, @Stumpings, @Points, GETDATE())",
                                new RoundPlayer(season, round, player, rnd), tran);

                        Console.WriteLine("Saving...");
                        tran.Commit();
                    }
                }
            }
        }
    }

    public class SeasonInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Runs { get; set; }
        public int UnassistedWickets { get; set; }
        public int AssistedWickets { get; set; }
        public int Catches { get; set; }
        public int Runouts { get; set; }
        public int Stumpings { get; set; }
    }

    public class RoundInfo
    {
        public Guid Id { get; set; }
        public int Name { get; set; }
        public int Status { get; set; }
    }

    public class PlayerInfo
    {
        public Guid Id { get; set; }
        public decimal Multiplier { get; set; }
    }

    public class RoundPlayer
    {
        public Guid RoundId { get; set; }
        public Guid PlayerId { get; set; }
        public int Runs { get; set; }
        public int UnassistedWickets { get; set; }
        public int AssistedWickets { get; set; }
        public int Catches { get; set; }
        public int Runouts { get; set; }
        public int Stumpings { get; set; }
        public int Points { get; set; }

        public RoundPlayer(SeasonInfo season, RoundInfo round, PlayerInfo player, Random rnd)
        {
            RoundId = round.Id;
            PlayerId = player.Id;
            Runs = rnd.Next(100);
            AssistedWickets = rnd.Next(5);
            UnassistedWickets = rnd.Next(5);
            Catches = rnd.Next(5);
            Runouts = Math.Max(0, rnd.Next(10) - 8);
            Stumpings = Math.Max(0, rnd.Next(20) - 18);
            Points = Convert.ToInt32(Math.Ceiling((Runs * season.Runs
                + AssistedWickets * season.AssistedWickets
                + UnassistedWickets * season.UnassistedWickets
                + Catches * season.Catches
                + Runouts * season.Runouts
                + Stumpings * season.Stumpings) * player.Multiplier));
        }
    }
}
