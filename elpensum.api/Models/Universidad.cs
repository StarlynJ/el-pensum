using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    // Info de una universidad
    public class Universidad
    {
        // Id único de la universidad
        public int Id { get; set; }

        // Nombre de la universidad (obligatorio)
        [Required]
        public string Nombre { get; set; } = string.Empty;

        // País donde está
        [Required]
        public string Pais { get; set; } = string.Empty;

        // Ciudad donde está
        [Required]
        public string Ciudad { get; set; } = string.Empty;

        // Ranking nacional y mundial (si aplica)
        public int RankingNacional { get; set; }
        public int RankingMundial { get; set; }

        // Logo de la universidad (obligatorio)
        [Required]
        public string LogoUrl { get; set; } = string.Empty;

        // Costos varios (pueden ser 0 si no aplica)
        public decimal CostoInscripcion { get; set; }
        public decimal CostoAdmision { get; set; }
        public decimal CostoCredito { get; set; }
        public decimal CostoCarnet { get; set; }

        // Imágenes del campus (opcional)
        public List<string> ImagenesCampus { get; set; } = new();
        // Carreras que ofrece esta universidad
        public List<CarreraUniversitaria> Carreras { get; set; } = new();
    }
}
