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
        public decimal CostoInscripcion { get; set; }
        public decimal CostoAdmision { get; set; }
        public decimal CostoCredito { get; set; }
        public int TotalCreditos { get; set; }
        public decimal CostoCarnet { get; set; }
        public string? PensumPdf { get; set; }
    }
}
