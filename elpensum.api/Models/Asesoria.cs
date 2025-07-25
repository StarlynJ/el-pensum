
namespace ElPensum.API.Models
{
    // Esta clase es para guardar la info de una asesoría pedida por un usuario
    public class Asesoria
    {
        // Id único de la asesoría
        public int Id { get; set; }

        // Nombre completo de quien pide la asesoría
        public string? NombreCompleto { get; set; }
        // Correo de contacto
        public string? Correo { get; set; }
        // Carrera de interés
        public string? CarreraInteres { get; set; }
        // Colegio de donde viene
        public string? Colegio { get; set; }
        // Edad del solicitante
        public int Edad { get; set; }
        // Comentarios extra que quiera dejar
        public string? Comentarios { get; set; }

        // Chequea si el correo tiene pinta de ser válido
        public bool EsCorreoValido() => !string.IsNullOrWhiteSpace(Correo) && Correo.Contains("@");

        // Verifica que el formulario tenga lo mínimo necesario
        public bool EsFormularioValido() =>
            !string.IsNullOrWhiteSpace(NombreCompleto) &&
            !string.IsNullOrWhiteSpace(Correo) &&
            EsCorreoValido();

        // Devuelve un resumen rápido de la asesoría
        public string ObtenerResumen() =>
            $"Nombre: {NombreCompleto}\nCorreo: {Correo}\nCarrera: {CarreraInteres}\nComentarios: {Comentarios}";
    }
}
