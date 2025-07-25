using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    // Info básica de una beca disponible
    public class Beca
    {
        // Id único de la beca
        public int Id { get; set; }

        // Título de la beca (obligatorio)
        [Required]
        public string Titulo { get; set; } = string.Empty;

        // Resumen corto de la beca (máx 300 caracteres)
        [Required]
        [MaxLength(300)] 
        public string Resumen { get; set; } = string.Empty;

        // Imagen de portada de la beca
        [Required]
        public string ImagenUrl { get; set; } = string.Empty;

        // Link directo a la página de la beca
        [Required]
        public string Enlace { get; set; } = string.Empty;
    }
}