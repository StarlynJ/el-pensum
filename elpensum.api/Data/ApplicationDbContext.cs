using Microsoft.EntityFrameworkCore;
using ElPensum.API.Models;


namespace ElPensum.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        public DbSet<Universidad> Universidades { get; set; }
        public DbSet<Carrera> Carreras { get; set; }
        public DbSet<CarreraUniversitaria> CarrerasUniversitarias { get; set; }
        public DbSet<Asesoria> Asesorias { get; set; }
        public DbSet<Usuario> Usuarios { get; set; } 


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<CarreraUniversitaria>()
                .HasOne(cu => cu.Universidad)
                .WithMany(u => u.Carreras)
                .HasForeignKey(cu => cu.UniversidadId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<CarreraUniversitaria>()
                .HasOne(cu => cu.Carrera)
                .WithMany(c => c.CarrerasUniversitarias)
                .HasForeignKey(cu => cu.CarreraId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.DuracionAnios)
                .HasPrecision(4, 2);


            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.CostoInscripcion)
                .HasPrecision(18, 2);


            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.CostoAdmision)
                .HasPrecision(18, 2);


            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.CostoCredito)
                .HasPrecision(18, 2);


            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.CostoCarnet)
                .HasPrecision(18, 2);
        }
    }
}




