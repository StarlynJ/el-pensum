// ElPensum.API/Controllers/ContenidoInicioController.cs

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace ElPensum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContenidoInicioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContenidoInicioController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ContenidoInicio
        // Endpoint PÚBLICO para que la página de inicio pueda obtener el contenido.
        [HttpGet]
        [AllowAnonymous] // Cualquiera puede acceder a este endpoint
        public async Task<ActionResult<ContenidoInicio>> GetContenidoInicio()
        {
            // Buscamos siempre el registro con Id = 1, que es nuestro único registro
            var contenido = await _context.ContenidoInicio.FindAsync(1);

            if (contenido == null)
            {
                // Esto no debería pasar gracias a los datos iniciales (seeding), pero es una buena práctica
                return NotFound("No se encontró el contenido de la página de inicio.");
            }

            return Ok(contenido);
        }

        // PUT: api/ContenidoInicio
        // Endpoint PRIVADO para que el administrador actualice el contenido.
        [HttpPut]
        [Authorize] // Solo usuarios autenticados (administradores) pueden acceder
        public async Task<IActionResult> UpdateContenidoInicio([FromBody] ContenidoInicio contenidoActualizado)
        {
            // Buscamos el registro existente en la base de datos
            var contenidoExistente = await _context.ContenidoInicio.FindAsync(1);

            if (contenidoExistente == null)
            {
                return NotFound("No se encontró el contenido para actualizar.");
            }

            // Actualizamos cada propiedad con los nuevos valores que vienen del frontend
            contenidoExistente.TituloVideo = contenidoActualizado.TituloVideo;
            contenidoExistente.TextoVideo = contenidoActualizado.TextoVideo;
            contenidoExistente.UrlVideoLoop = contenidoActualizado.UrlVideoLoop;
            contenidoExistente.UrlVideoYoutube = contenidoActualizado.UrlVideoYoutube;
            contenidoExistente.UrlCanalYoutube = contenidoActualizado.UrlCanalYoutube;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Manejo de errores en caso de que algo falle al guardar
                throw;
            }

            return NoContent(); // Respuesta estándar para una actualización exitosa (HTTP 204)
        }
    }
}