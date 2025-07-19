using System.ComponentModel.DataAnnotations; // Añadimos esta línea

namespace ElPensum.API.Models
{
    public class Carrera
    {
        public int Id { get; set; }

        [Required] 
        public string Nombre { get; set; } = string.Empty;

        // NUEVO CAMPO: Guardará la URL del ícono para la carrera
        public string? IconoUrl { get; set; }

        public List<CarreraUniversitaria> CarrerasUniversitarias { get; set; } = new();
    }
}