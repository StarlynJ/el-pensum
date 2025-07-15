using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElPensum.API.Data;
using ElPensum.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElPensum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BecasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BecasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/becas
        // Endpoint público para que todos los usuarios puedan ver las becas
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Beca>>> GetBecas()
        {
            return await _context.Becas.ToListAsync();
        }

        // GET: api/becas/5
        // Endpoint protegido para que el admin pueda ver el detalle de una beca
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Beca>> GetBeca(int id)
        {
            var beca = await _context.Becas.FindAsync(id);

            if (beca == null)
            {
                return NotFound();
            }

            return beca;
        }

        // POST: api/becas
        // Endpoint protegido para crear una nueva beca
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Beca>> PostBeca(Beca beca)
        {
            _context.Becas.Add(beca);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBeca), new { id = beca.Id }, beca);
        }

        // PUT: api/becas/5
        // Endpoint protegido para actualizar una beca existente
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutBeca(int id, Beca beca)
        {
            if (id != beca.Id)
            {
                return BadRequest();
            }

            _context.Entry(beca).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Becas.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/becas/5
        // Endpoint protegido para eliminar una beca
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBeca(int id)
        {
            var beca = await _context.Becas.FindAsync(id);
            if (beca == null)
            {
                return NotFound();
            }

            _context.Becas.Remove(beca);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}