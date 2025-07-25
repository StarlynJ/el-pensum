// elpensum.api/Data/ApplicationDbContext.cs

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
        public DbSet<Beca> Becas { get; set; }
        
        // --- NUEVA LÍNEA AÑADIDA ---
        public DbSet<ContenidoInicio> ContenidoInicio { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // --- NUEVO BLOQUE AÑADIDO: DATOS INICIALES ---
            // Esto crea un registro por defecto la primera vez que se aplica la migración.
            // Así nos aseguramos de que siempre haya un registro con Id = 1 para editar.
            modelBuilder.Entity<ContenidoInicio>().HasData(
                new ContenidoInicio
                {
                    Id = 1, // Id fija
                    TituloVideo = "Título de Ejemplo",
                    TextoVideo = "Este es un texto de ejemplo que puedes editar desde el panel de administración.",
                    UrlVideoLoop = "https://videos.pexels.com/video-files/5844238/5844238-sd_640_360_30fps.mp4",
                    UrlVideoYoutube = "https://www.youtube.com",
                    UrlCanalYoutube = "https://www.youtube.com"
                }
            );
            // --------------------------------------------------

            // --- Relaciones ---
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

            // --- Configuraciones de Precisión ---
            modelBuilder.Entity<CarreraUniversitaria>()
                .Property(cu => cu.DuracionAnios)
                .HasPrecision(4, 2);

            modelBuilder.Entity<Universidad>()
                .Property(u => u.CostoInscripcion)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Universidad>()
                .Property(u => u.CostoAdmision)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Universidad>()
                .Property(u => u.CostoCredito)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Universidad>()
                .Property(u => u.CostoCarnet)
                .HasPrecision(18, 2);
        }
    }
}