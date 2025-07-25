namespace ElPensum.API.Models
{
    // Usuario del sistema (para login, etc)
    public class Usuario
    {
        // Id único del usuario
        public int Id { get; set; }
        // Nombre de usuario
        public string Username { get; set; } = string.Empty;
        // Contraseña (hash, no texto plano)
        public string PasswordHash { get; set; } = string.Empty;
    }
}
