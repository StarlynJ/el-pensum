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
    public class CarrerasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarrerasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Carrera>>> GetCarreras()
        {
            return await _context.Carreras.ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<ActionResult<Carrera>> GetCarrera(int id)
        {
            var carrera = await _context.Carreras
                .Include(c => c.CarrerasUniversitarias)
                    .ThenInclude(cu => cu.Universidad)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (carrera == null)
                return NotFound("Carrera no encontrada.");

            return carrera;
        }

        [HttpPost]
        public async Task<IActionResult> CrearCarrera([FromBody] Carrera carrera)
        {
            if (carrera == null || string.IsNullOrWhiteSpace(carrera.Nombre))
                return BadRequest("Nombre de carrera inválido.");

            _context.Carreras.Add(carrera);
            await _context.SaveChangesAsync();

            return Ok(carrera);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarCarrera(int id, [FromBody] Carrera carrera)
        {
            if (id != carrera.Id)
                return BadRequest("ID no coincide.");

            var carreraExistente = await _context.Carreras.FindAsync(id);
            if (carreraExistente == null)
                return NotFound("Carrera no encontrada.");

            carreraExistente.Nombre = carrera.Nombre;

            await _context.SaveChangesAsync();

            return Ok(carreraExistente);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarCarrera(int id)
        {
            var carrera = await _context.Carreras.FindAsync(id);
            if (carrera == null)
                return NotFound("Carrera no encontrada.");

            _context.Carreras.Remove(carrera);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

