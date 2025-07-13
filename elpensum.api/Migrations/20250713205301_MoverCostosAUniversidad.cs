using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace elpensum.api.Migrations
{
    /// <inheritdoc />
    public partial class MoverCostosAUniversidad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Noticias");

            migrationBuilder.DropColumn(
                name: "CostoAdmision",
                table: "CarrerasUniversitarias");

            migrationBuilder.DropColumn(
                name: "CostoCarnet",
                table: "CarrerasUniversitarias");

            migrationBuilder.DropColumn(
                name: "CostoCredito",
                table: "CarrerasUniversitarias");

            migrationBuilder.DropColumn(
                name: "CostoInscripcion",
                table: "CarrerasUniversitarias");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoAdmision",
                table: "Universidades",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoCarnet",
                table: "Universidades",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoCredito",
                table: "Universidades",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoInscripcion",
                table: "Universidades",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CostosAdicionales",
                table: "CarrerasUniversitarias",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostoAdmision",
                table: "Universidades");

            migrationBuilder.DropColumn(
                name: "CostoCarnet",
                table: "Universidades");

            migrationBuilder.DropColumn(
                name: "CostoCredito",
                table: "Universidades");

            migrationBuilder.DropColumn(
                name: "CostoInscripcion",
                table: "Universidades");

            migrationBuilder.DropColumn(
                name: "CostosAdicionales",
                table: "CarrerasUniversitarias");

            migrationBuilder.AddColumn<decimal>(
                name: "CostoAdmision",
                table: "CarrerasUniversitarias",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoCarnet",
                table: "CarrerasUniversitarias",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoCredito",
                table: "CarrerasUniversitarias",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CostoInscripcion",
                table: "CarrerasUniversitarias",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "Noticias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Contenido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaPublicacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImagenUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Resumen = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Noticias", x => x.Id);
                });
        }
    }
}
