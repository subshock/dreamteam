using DreamTeam.Data;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DreamTeam.Services
{
    public class ImportService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger _logger;

        public ImportService(ApplicationDbContext db, ILogger<ImportService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<(bool Result, IEnumerable<string> Messages)> ImportPlayersFromExcel(Guid seasonId, bool hasHeaders, bool overwrite, Stream stream)
        {
            var messages = new List<string>();

            int GetSafeInteger(IExcelDataReader reader, int index, int defaultValue = default(int))
            {
                if (reader.FieldCount <= index) return defaultValue;
                try
                {
                    return Convert.ToInt32(reader.GetDouble(index));
                }
                catch (InvalidCastException)
                {
                    return defaultValue;
                }
            }

            using (var rdr = ExcelReaderFactory.CreateReader(stream))
            {
                var idx = 0;
                var added = 0;
                var updated = 0;
                var players = await _db.Players.Where(x => x.SeasonId == seasonId).ToListAsync();

                try
                {
                    while (rdr.Read())
                    {
                        idx++;

                        if (hasHeaders && idx == 1)
                            continue;

                        if (rdr.FieldCount > 0)
                        {
                            var name = rdr.GetString(0);

                            if (string.IsNullOrEmpty(name)) continue;

                            var cost = GetSafeInteger(rdr, 1);
                            var multiplier = GetSafeInteger(rdr, 2, 1);

                            // check if this player exists, otherwise create a new one
                            var player = players.FirstOrDefault(x => x.Name.SeCi(name));

                            if (player != null)
                            {
                                if (overwrite)
                                {
                                    player.Cost = cost;
                                    player.Multiplier = multiplier;
                                    player.Updated = DateTimeOffset.Now;
                                    updated++;
                                }
                            }
                            else
                            {
                                player = new Models.Player
                                {
                                    Id = Guid.NewGuid(),
                                    SeasonId = seasonId,
                                    Name = name,
                                    Cost = cost,
                                    Multiplier = multiplier,
                                    Created = DateTimeOffset.Now,
                                };
                                await _db.Players.AddAsync(player);
                                added++;
                            }
                        }
                    }

                    if (added > 0 || updated > 0)
                    {
                        messages.Add($"Added {added} and Updated {updated} players in the season");

                        await _db.SaveChangesAsync();
                    } else
                    {
                        messages.Add("There were no additions to the players");
                    }

                    return (true, messages);
                } catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception when importing players");
                    messages.Add("ERROR: There was an error importing players, no changes have been made");
                }
            }

            return (false, messages);
        }
    }
}
