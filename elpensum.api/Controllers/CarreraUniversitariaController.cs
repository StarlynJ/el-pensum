using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElPensum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CarreraUniversitariaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarreraUniversitariaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/carrerauniversitaria/universidades-por-carrera/{idCarrera}
        [HttpGet("universidades-por-carrera/{idCarrera}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Universidad>>> GetUniversidadesPorCarrera(int idCarrera)
        {
            var universidades = await _context.CarrerasUniversitarias
                .Include(cu => cu.Universidad)
                .Where(cu => cu.CarreraId == idCarrera)
                .Select(cu => cu.Universidad)
                .Distinct()
                .ToListAsync();

            return universidades!;
        }

        // GET: api/carrerauniversitaria/comparacion
        [HttpGet("comparacion")]
        [AllowAnonymous]
        // ✅ CAMBIO: Ahora acepta una lista de IDs de universidad
        public async Task<IActionResult> CompararCarreras(
            [FromQuery] int[] ids, [FromQuery] string carrera)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("Debe proporcionar al menos un ID de universidad.");
            }

            var resultados = await _context.CarrerasUniversitarias
                .Include(cu => cu.Universidad)
                .Include(cu => cu.Carrera)
                .Where(cu =>
                    ids.Contains(cu.UniversidadId) && // Usamos .Contains() para buscar en la lista
                    cu.Carrera != null && cu.Carrera.Nombre == carrera)
                .OrderBy(cu => cu.UniversidadId)
                .ToListAsync();

            if (resultados.Count < ids.Length)
            {
                return NotFound("No se encontraron registros para todas las universidades solicitadas en esa carrera.");
            }

            return Ok(resultados);
        }

        // POST: api/carrerauniversitaria
        [HttpPost]
        public async Task<IActionResult> AsignarCarrera([FromBody] CarreraUniversitaria cu)
        {
            if (cu == null || cu.UniversidadId == 0 || cu.CarreraId == 0)
                return BadRequest("Faltan datos requeridos.");

            var universidadExiste = await _context.Universidades.AnyAsync(u => u.Id == cu.UniversidadId);
            var carreraExiste = await _context.Carreras.AnyAsync(c => c.Id == cu.CarreraId);

            if (!universidadExiste || !carreraExiste)
                return NotFound("Universidad o carrera no encontrada.");

            _context.CarrerasUniversitarias.Add(cu);
            await _context.SaveChangesAsync();

            return Ok(cu);
        }

        // PUT: api/carrerauniversitaria/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarRelacion(int id, [FromBody] CarreraUniversitaria cu)
        {
            if (id != cu.Id)
                return BadRequest("ID no coincide.");

            var cuExistente = await _context.CarrerasUniversitarias.FindAsync(id);
            if (cuExistente == null)
                return NotFound("Relación no encontrada.");

            cuExistente.DuracionAnios = cu.DuracionAnios;
            cuExistente.TotalCreditos = cu.TotalCreditos;
            cuExistente.PensumPdf = cu.PensumPdf;
            cuExistente.CostosAdicionales = cu.CostosAdicionales;

            await _context.SaveChangesAsync();

            return Ok(cuExistente);
        }

        // DELETE: api/carrerauniversitaria/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var asignacion = await _context.CarrerasUniversitarias.FindAsync(id);
            if (asignacion == null)
                return NotFound("Asignación no encontrada.");

            _context.CarrerasUniversitarias.Remove(asignacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}



