using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class TeamCaptains : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "TeamPlayers");

            migrationBuilder.CreateTable(
                name: "TeamCaptains",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TradePeriodId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CaptainId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViceCaptainId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Removed = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamCaptains", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamCaptains_Players_CaptainId",
                        column: x => x.CaptainId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_TeamCaptains_Players_ViceCaptainId",
                        column: x => x.ViceCaptainId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_TeamCaptains_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_TeamCaptains_TradePeriods_TradePeriodId",
                        column: x => x.TradePeriodId,
                        principalTable: "TradePeriods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamCaptains_CaptainId",
                table: "TeamCaptains",
                column: "CaptainId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamCaptains_TeamId",
                table: "TeamCaptains",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamCaptains_TradePeriodId",
                table: "TeamCaptains",
                column: "TradePeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamCaptains_ViceCaptainId",
                table: "TeamCaptains",
                column: "ViceCaptainId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamCaptains");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "TeamPlayers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
