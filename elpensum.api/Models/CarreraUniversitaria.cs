
namespace ElPensum.API.Models
{
    // Relación entre una carrera y una universidad específica
    public class CarreraUniversitaria
    {
        // Id único de la relación
        public int Id { get; set; }

        // Universidad a la que pertenece
        public int UniversidadId { get; set; }
        public Universidad? Universidad { get; set; }

        // Carrera asociada
        public int CarreraId { get; set; }
        public Carrera? Carrera { get; set; }

        // Duración de la carrera en años
        public decimal DuracionAnios { get; set; }
        // Total de créditos necesarios
        public int TotalCreditos { get; set; }
        // PDF del pensum (opcional)
        public string? PensumPdf { get; set; }

        // Info extra como costos, exámenes, etc (opcional)
        public string? CostosAdicionales { get; set; }
    }
}
