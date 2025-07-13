using ElPensum.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace ElPensum.API.Data
{
    public static class Seeder
    {
        public static void Inicializar(ApplicationDbContext context)
        {
            if (context.Universidades.Any())
            {
                return; // Si ya hay datos, no hacemos nada.
            }

            // Crear carreras
            var carrera1 = new Carrera { Nombre = "Ingeniería en Sistemas" };
            var carrera2 = new Carrera { Nombre = "Medicina" };

            // Crear universidades con sus costos
            var universidad1 = new Universidad
            {
                Nombre = "Universidad Autónoma de Santo Domingo (UASD)",
                Pais = "República Dominicana",
                Ciudad = "Santo Domingo",
                RankingNacional = 1,
                RankingMundial = 1500,
                LogoUrl = "/assets/universidades/logos/uasd.png",
                CostoInscripcion = 3000, // ✅ Costo movido aquí
                CostoAdmision = 2000,    // ✅ Costo movido aquí
                CostoCredito = 1200,    // ✅ Costo movido aquí
                CostoCarnet = 500,      // ✅ Costo movido aquí
                ImagenesCampus = new List<string> { "/assets/universidades/campus/uasd-campus1.jpg" }
            };

            var universidad2 = new Universidad
            {
                Nombre = "Pontificia Universidad Católica Madre y Maestra (PUCMM)",
                Pais = "República Dominicana",
                Ciudad = "Santiago",
                RankingNacional = 2,
                RankingMundial = 1200,
                LogoUrl = "/assets/universidades/logos/pucmm.png",
                CostoInscripcion = 4000,
                CostoAdmision = 2500,
                CostoCredito = 1500,
                CostoCarnet = 600,
                ImagenesCampus = new List<string> { "/assets/universidades/campus/pucmm-campus1.jpg" }
            };
            
            var universidad3 = new Universidad
            {
                Nombre = "Instituto Tecnológico de Santo Domingo (INTEC)",
                Pais = "República Dominicana",
                Ciudad = "Santo Domingo",
                RankingNacional = 3,
                RankingMundial = 1300,
                LogoUrl = "/assets/universidades/logos/intec.png",
                CostoInscripcion = 3500,
                CostoAdmision = 1800,
                CostoCredito = 1400,
                CostoCarnet = 550,
                ImagenesCampus = new List<string> { "/assets/universidades/campus/intec-campus1.jpg" }
            };

            context.Carreras.AddRange(carrera1, carrera2);
            context.Universidades.AddRange(universidad1, universidad2, universidad3);
            context.SaveChanges(); // Guardamos para que las universidades y carreras tengan IDs

            // Crear relaciones universidad-carrera (ahora sin costos directos)
            var relacion1 = new CarreraUniversitaria
            {
                UniversidadId = universidad1.Id,
                CarreraId = carrera1.Id,
                DuracionAnios = 5,
                TotalCreditos = 180,
                PensumPdf = "/assets/pensum/pensum-uasd-sistemas.pdf",
                CostosAdicionales = "No incluye costos de laboratorio." // ✅ Nuevo campo
            };

            var relacion2 = new CarreraUniversitaria
            {
                UniversidadId = universidad2.Id,
                CarreraId = carrera2.Id,
                DuracionAnios = 6,
                TotalCreditos = 200,
                PensumPdf = "/assets/pensum/pensum-pucmm-medicina.pdf",
                CostosAdicionales = "Requiere seguro médico obligatorio."
            };

            var relacion3 = new CarreraUniversitaria
            {
                UniversidadId = universidad3.Id,
                CarreraId = carrera1.Id,
                DuracionAnios = 4,
                TotalCreditos = 190,
                PensumPdf = "/assets/pensum/pensum-intec-sistemas.pdf",
                CostosAdicionales = null // Es opcional
            };

            context.CarrerasUniversitarias.AddRange(relacion1, relacion2, relacion3);

            // Usuario admin
            if (!context.Usuarios.Any(u => u.Username == "admin"))
            {
                using var sha256 = SHA256.Create();
                var passwordHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes("Admin1234!")));
                context.Usuarios.Add(new Usuario { Username = "admin", PasswordHash = passwordHash });
            }

            context.SaveChanges();
        }
    }
}




