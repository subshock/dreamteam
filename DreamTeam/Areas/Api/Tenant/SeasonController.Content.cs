using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace DreamTeam.Areas.Api.Tenant
{
    public partial class SeasonController 
    {
        [HttpGet("{seasonId:guid}/content/{name}")]
        public async Task<IActionResult> GetContent(Guid seasonId, string name)
        {
            var obj = await _db.SeasonContents.FirstOrDefaultAsync(x => x.SeasonId == seasonId && x.Name == name);

            return Ok(new SeasonContentInfo
            {
                Name = obj?.Name ?? name,
                Content = obj?.Content ?? ""
            });
        }

        [HttpPost("{seasonId:guid}/content/{name}")]
        public async Task<IActionResult> UpdateContent(Guid seasonId, string name, [FromBody] SeasonContentInfo model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _db.UpdateSeasonContent(seasonId, name, model.Content);

            return Ok();
        }

        public class SeasonContentInfo
        {
            public string Name { get; set; }
            [Required]
            public string Content { get; set; }
        }
    }
}
