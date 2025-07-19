using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace elpensum.api.Migrations
{
    /// <inheritdoc />
    public partial class AnadirIconoUrlACarreras : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Carreras",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IconoUrl",
                table: "Carreras",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconoUrl",
                table: "Carreras");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Carreras",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
