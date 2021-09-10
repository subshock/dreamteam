using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class TradePeriodSeason : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SeasonId",
                table: "TradePeriods",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TradePeriods_SeasonId",
                table: "TradePeriods",
                column: "SeasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_TradePeriods_Seasons_SeasonId",
                table: "TradePeriods",
                column: "SeasonId",
                principalTable: "Seasons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TradePeriods_Seasons_SeasonId",
                table: "TradePeriods");

            migrationBuilder.DropIndex(
                name: "IX_TradePeriods_SeasonId",
                table: "TradePeriods");

            migrationBuilder.DropColumn(
                name: "SeasonId",
                table: "TradePeriods");
        }
    }
}
