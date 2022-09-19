using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DreamTeam.Data.Migrations
{
    public partial class Tenants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var tenantId = Guid.NewGuid();

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "Seasons",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Tenants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tenants", x => x.Id);
                });

            migrationBuilder.InsertData("Tenants",
                new[] { "Id", "Name", "Slug", "Enabled", "Created", "Updated" },
                new object[] { tenantId, "Sandhurst Cricket Club", "scc", true, DateTimeOffset.Now, DateTimeOffset.Now });
            migrationBuilder.Sql("EXEC ('UPDATE Seasons SET TenantId=(SELECT TOP(1) Id FROM Tenants)')");

            migrationBuilder.CreateTable(
                name: "TenantAdmins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Created = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    Updated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TenantAdmins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TenantAdmins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TenantAdmins_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql("EXEC ('INSERT INTO TenantAdmins (Id, TenantId, UserId, Created, Updated) " +
                "SELECT newid(), (SELECT TOP(1) Id FROM Tenants), UR.UserId, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET() " +
                "FROM AspNetUserRoles AS UR INNER JOIN AspNetRoles AS R ON UR.RoleId=R.Id WHERE R.Name=''Administrator'' ')");

            migrationBuilder.CreateIndex(
                name: "IX_Tenants_Slug",
                table: "Tenants",
                column: "Slug"
            );

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_TenantId",
                table: "Seasons",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TenantAdmins_TenantId",
                table: "TenantAdmins",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TenantAdmins_UserId",
                table: "TenantAdmins",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seasons_Tenants_TenantId",
                table: "Seasons",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seasons_Tenants_TenantId",
                table: "Seasons");

            migrationBuilder.DropTable(
                name: "TenantAdmins");

            migrationBuilder.DropTable(
                name: "Tenants");

            migrationBuilder.DropIndex(
                name: "IX_Seasons_TenantId",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Seasons");
        }
    }
}
