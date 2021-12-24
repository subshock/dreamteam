using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class RoundAndSeasonStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "State",
                table: "TaskLogs",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Seasons",
                newName: "Status");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Rounds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.DropColumn(
                name: "Completed",
                table: "Rounds");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Rounds");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "TaskLogs",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Seasons",
                newName: "State");

            migrationBuilder.AddColumn<bool>(
                name: "Completed",
                table: "Rounds",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
