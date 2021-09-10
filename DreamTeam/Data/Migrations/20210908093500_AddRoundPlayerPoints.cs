using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class AddRoundPlayerPoints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "RoundPlayers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Points",
                table: "RoundPlayers");
        }
    }
}
