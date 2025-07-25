using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace elpensum.api.Migrations
{
    /// <inheritdoc />
    public partial class AddContenidoInicioTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContenidoInicio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TituloVideo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TextoVideo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    UrlVideoLoop = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UrlVideoYoutube = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UrlCanalYoutube = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContenidoInicio", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ContenidoInicio",
                columns: new[] { "Id", "TextoVideo", "TituloVideo", "UrlCanalYoutube", "UrlVideoLoop", "UrlVideoYoutube" },
                values: new object[] { 1, "Este es un texto de ejemplo que puedes editar desde el panel de administración.", "Título de Ejemplo", "https://www.youtube.com", "https://videos.pexels.com/video-files/5844238/5844238-sd_640_360_30fps.mp4", "https://www.youtube.com" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContenidoInicio");
        }
    }
}
