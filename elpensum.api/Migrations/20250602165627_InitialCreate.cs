using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace elpensum.api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Asesorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreCompleto = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CarreraInteres = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Colegio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Edad = table.Column<int>(type: "int", nullable: false),
                    Comentarios = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Asesorias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Carreras",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carreras", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Universidades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pais = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ciudad = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RankingNacional = table.Column<int>(type: "int", nullable: false),
                    RankingMundial = table.Column<int>(type: "int", nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImagenesCampus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Universidades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CarrerasUniversitarias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UniversidadId = table.Column<int>(type: "int", nullable: false),
                    CarreraId = table.Column<int>(type: "int", nullable: false),
                    DuracionAnios = table.Column<int>(type: "int", nullable: false),
                    CostoInscripcion = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostoAdmision = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostoCredito = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalCreditos = table.Column<int>(type: "int", nullable: false),
                    CostoCarnet = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PensumPdf = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarrerasUniversitarias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarrerasUniversitarias_Carreras_CarreraId",
                        column: x => x.CarreraId,
                        principalTable: "Carreras",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CarrerasUniversitarias_Universidades_UniversidadId",
                        column: x => x.UniversidadId,
                        principalTable: "Universidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarrerasUniversitarias_CarreraId",
                table: "CarrerasUniversitarias",
                column: "CarreraId");

            migrationBuilder.CreateIndex(
                name: "IX_CarrerasUniversitarias_UniversidadId",
                table: "CarrerasUniversitarias",
                column: "UniversidadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Asesorias");

            migrationBuilder.DropTable(
                name: "CarrerasUniversitarias");

            migrationBuilder.DropTable(
                name: "Carreras");

            migrationBuilder.DropTable(
                name: "Universidades");
        }
    }
}
