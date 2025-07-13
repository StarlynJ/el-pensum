namespace ElPensum.API.Models
{
    public class CarreraUniversitaria
    {
        public int Id { get; set; }

        public int UniversidadId { get; set; }
        public Universidad? Universidad { get; set; }

        public int CarreraId { get; set; }
        public Carrera? Carrera { get; set; }

        public decimal DuracionAnios { get; set; }
        public int TotalCreditos { get; set; }
        public string? PensumPdf { get; set; }

        // --- NUEVO CAMPO OPCIONAL ---
        public string? CostosAdicionales { get; set; } // Para información extra como "Examen de admisión: $50"
        // -----------------------------
    }
}
