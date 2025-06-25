using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ElPensum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class UniversidadesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UniversidadesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/universidades
        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Universidad>>> GetUniversidades()
        {
            return await _context.Universidades
                .Include(u => u.Carreras)
                .ToListAsync();
        }

        // GET: api/universidades/filtrar?nombre=...
        [HttpGet("filtrar")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<Universidad>>> FiltrarUniversidades([FromQuery] string? nombre)
        {
            var query = _context.Universidades.AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
            {
                query = query.Where(u => u.Nombre.Contains(nombre));
            }

            return await query.ToListAsync();
        }

        // GET: api/universidades/5
        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<ActionResult<Universidad>> GetUniversidad(int id)
        {
            var universidad = await _context.Universidades
                .Include(u => u.Carreras)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (universidad == null)
            {
                return NotFound();
            }

            return universidad;
        }

        // GET: api/universidades/5/carreras
        [HttpGet("{id}/carreras")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<CarreraUniversitaria>>> ObtenerCarrerasAsignadas(int id)
        {
            var carreras = await _context.CarrerasUniversitarias
                .Include(cu => cu.Carrera)
                .Where(cu => cu.UniversidadId == id)
                .ToListAsync();

            return Ok(carreras);
        }

        // POST: api/universidades
        [HttpPost]
        public async Task<ActionResult<Universidad>> PostUniversidad(Universidad universidad)
        {
            _context.Universidades.Add(universidad);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUniversidad), new { id = universidad.Id }, universidad);
        }

        // PUT: api/universidades/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUniversidad(int id, Universidad universidad)
        {
            if (id != universidad.Id)
                return BadRequest();

            _context.Entry(universidad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Universidades.Any(u => u.Id == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // DELETE: api/universidades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUniversidad(int id)
        {
            var universidad = await _context.Universidades.FindAsync(id);
            if (universidad == null)
                return NotFound();

            _context.Universidades.Remove(universidad);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}





