using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Authorization;

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

<<<<<<< HEAD
=======
        // Obtener universidades que imparten una carrera
>>>>>>> 01a59975eddbb0b7b2143d8a8f4f40a43fda710b
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
        public async Task<IActionResult> CompararCarreras(
            [FromQuery] int uni1, [FromQuery] int uni2, [FromQuery] string carrera)
        {
            var resultados = await _context.CarrerasUniversitarias
                .Include(cu => cu.Universidad)
                .Include(cu => cu.Carrera)
                .Where(cu =>
                    (cu.UniversidadId == uni1 || cu.UniversidadId == uni2) &&
                    cu.Carrera != null && cu.Carrera.Nombre == carrera)
                .ToListAsync();

            if (resultados.Count < 2)
                return NotFound("No se encontraron registros suficientes para comparar.");

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

            // ✅ **CAMBIO**: Actualizamos solo los campos que aún existen en el modelo
            cuExistente.DuracionAnios = cu.DuracionAnios;
            cuExistente.TotalCreditos = cu.TotalCreditos;
            cuExistente.PensumPdf = cu.PensumPdf;
            cuExistente.CostosAdicionales = cu.CostosAdicionales; // Y el nuevo campo

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



