using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class MoreDreamTeamEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssistedWickets",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Catches",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Runouts",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Runs",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Stumpings",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UnassistedWickets",
                table: "Seasons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Rounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SeasonId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rounds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rounds_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoundPlayers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoundId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Runs = table.Column<int>(type: "int", nullable: false),
                    UnassistedWickets = table.Column<int>(type: "int", nullable: false),
                    AssistedWickets = table.Column<int>(type: "int", nullable: false),
                    Catches = table.Column<int>(type: "int", nullable: false),
                    Runouts = table.Column<int>(type: "int", nullable: false),
                    Stumpings = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoundPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoundPlayers_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RoundPlayers_Rounds_RoundId",
                        column: x => x.RoundId,
                        principalTable: "Rounds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoundPlayers_PlayerId",
                table: "RoundPlayers",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_RoundPlayers_RoundId",
                table: "RoundPlayers",
                column: "RoundId");

            migrationBuilder.CreateIndex(
                name: "IX_Rounds_SeasonId",
                table: "Rounds",
                column: "SeasonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoundPlayers");

            migrationBuilder.DropTable(
                name: "Rounds");

            migrationBuilder.DropColumn(
                name: "AssistedWickets",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "Catches",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "Runouts",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "Runs",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "Stumpings",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "UnassistedWickets",
                table: "Seasons");
        }
    }
}
