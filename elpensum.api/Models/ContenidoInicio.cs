// ElPensum.API/Models/ContenidoInicio.cs

using System.ComponentModel.DataAnnotations;

namespace ElPensum.API.Models
{
    public class ContenidoInicio
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string TituloVideo { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string TextoVideo { get; set; } = string.Empty;

        [Required]
        public string UrlVideoLoop { get; set; } = string.Empty;

        [Required]
        public string UrlVideoYoutube { get; set; } = string.Empty;

        [Required]
        public string UrlCanalYoutube { get; set; } = string.Empty;
    }
}