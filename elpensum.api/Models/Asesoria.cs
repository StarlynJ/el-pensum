namespace ElPensum.API.Models
{
    public class Asesoria
    {
        public int Id { get; set; }

        public string? NombreCompleto { get; set; }
        public string? Correo { get; set; }
        public string? CarreraInteres { get; set; }
        public string? Colegio { get; set; }
        public int Edad { get; set; }
        public string? Comentarios { get; set; }

        public bool EsCorreoValido() => !string.IsNullOrWhiteSpace(Correo) && Correo.Contains("@");

        public bool EsFormularioValido() =>
            !string.IsNullOrWhiteSpace(NombreCompleto) &&
            !string.IsNullOrWhiteSpace(Correo) &&
            EsCorreoValido();

        public string ObtenerResumen() =>
            $"Nombre: {NombreCompleto}\nCorreo: {Correo}\nCarrera: {CarreraInteres}\nComentarios: {Comentarios}";
    }
}
