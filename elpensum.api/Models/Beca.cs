using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    public class Beca
    {
        public int Id { get; set; }

        [Required]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [MaxLength(300)] 
        public string Resumen { get; set; } = string.Empty;

        [Required]
        public string ImagenUrl { get; set; } = string.Empty; // Ruta a la imagen de portada

        [Required]
        public string Enlace { get; set; } = string.Empty; // Link a la página de la beca
    }
}