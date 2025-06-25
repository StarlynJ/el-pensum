
namespace ElPensum.API.Models
{
    public class Carrera
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }

         public List<CarreraUniversitaria> CarrerasUniversitarias { get; set; } = new();

    }
}