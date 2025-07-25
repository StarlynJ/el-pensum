namespace ElPensum.API.Models
{
    // DTO para login (lo que manda el usuario al iniciar sesión)
    public class UsuarioLoginDTO
    {
        // Nombre de usuario
        public string Username { get; set; } = string.Empty;
        // Contraseña (texto plano, solo para el login)
        public string Password { get; set; } = string.Empty;
    }
}
