using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    public class Universidad
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Pais { get; set; } = string.Empty;

        [Required]
        public string Ciudad { get; set; } = string.Empty;

        public int RankingNacional { get; set; }

        public int RankingMundial { get; set; }

        [Required]
        public string LogoUrl { get; set; } = string.Empty;

        public List<string> ImagenesCampus { get; set; } = new();

        public List<CarreraUniversitaria> Carreras { get; set; } = new(); // Relación con carreras ofrecidas
    }
}
