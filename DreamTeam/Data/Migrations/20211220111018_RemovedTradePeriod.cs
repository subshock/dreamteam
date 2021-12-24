using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class RemovedTradePeriod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RemovedTradePeriodId",
                table: "TeamPlayers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RemovedTradePeriodId",
                table: "TeamCaptains",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamPlayers_RemovedTradePeriodId",
                table: "TeamPlayers",
                column: "RemovedTradePeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamCaptains_RemovedTradePeriodId",
                table: "TeamCaptains",
                column: "RemovedTradePeriodId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeamCaptains_TradePeriods_RemovedTradePeriodId",
                table: "TeamCaptains",
                column: "RemovedTradePeriodId",
                principalTable: "TradePeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TeamPlayers_TradePeriods_RemovedTradePeriodId",
                table: "TeamPlayers",
                column: "RemovedTradePeriodId",
                principalTable: "TradePeriods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeamCaptains_TradePeriods_RemovedTradePeriodId",
                table: "TeamCaptains");

            migrationBuilder.DropForeignKey(
                name: "FK_TeamPlayers_TradePeriods_RemovedTradePeriodId",
                table: "TeamPlayers");

            migrationBuilder.DropIndex(
                name: "IX_TeamPlayers_RemovedTradePeriodId",
                table: "TeamPlayers");

            migrationBuilder.DropIndex(
                name: "IX_TeamCaptains_RemovedTradePeriodId",
                table: "TeamCaptains");

            migrationBuilder.DropColumn(
                name: "RemovedTradePeriodId",
                table: "TeamPlayers");

            migrationBuilder.DropColumn(
                name: "RemovedTradePeriodId",
                table: "TeamCaptains");
        }
    }
}
