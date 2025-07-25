using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    // Representa una carrera (ej: Ingeniería, Medicina, etc)
    public class Carrera
    {
        // Id único de la carrera
        public int Id { get; set; }

        // Nombre de la carrera (obligatorio)
        [Required] 
        public string Nombre { get; set; } = string.Empty;

        // URL del ícono de la carrera (opcional)
        public string? IconoUrl { get; set; }

        // Relación con las universidades donde se imparte
        public List<CarreraUniversitaria> CarrerasUniversitarias { get; set; } = new();
    }
}