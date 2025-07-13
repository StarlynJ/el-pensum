using Microsoft.AspNetCore.Mvc;
using ElPensum.API.Data;
using ElPensum.API.Models;
using ElPensum.API.Core.Services;

namespace ElPensum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsesoriaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public AsesoriaController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/asesoria
        
        [HttpPost]
        public async Task<IActionResult> EnviarAsesoria([FromBody] Asesoria asesoria)
        {
            if (!asesoria.EsFormularioValido())
            {
                return BadRequest("Formulario incompleto o correo inválido.");
            }

            // Guardar asesoría en la base de datos
            _context.Asesorias.Add(asesoria);
            await _context.SaveChangesAsync();

            // Enviar resumen por correo
            var asunto = "Nueva solicitud de asesoría - El Pensum";
            var cuerpo = asesoria.ObtenerResumen();

            try
            {
                _emailService.EnviarCorreo(asunto, cuerpo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"La asesoría fue guardada, pero falló el envío del correo: {ex.Message}");
            }

            return Ok(new
            {
                mensaje = "Solicitud de asesoría recibida y correo enviado correctamente.",
                resumen = cuerpo
            });
        }
    }
}
