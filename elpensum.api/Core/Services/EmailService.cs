using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace ElPensum.API.Core.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void EnviarCorreo(string asunto, string cuerpo)
        {
            var smtpSettings = _config.GetSection("Smtp");

            var host = smtpSettings["Host"];
            var port = smtpSettings.GetValue<int>("Port");
            var enableSsl = smtpSettings.GetValue<bool>("EnableSsl");
            var user = smtpSettings["User"];
            var pass = smtpSettings["Password"];
            var from = smtpSettings["From"];
            var to = smtpSettings["To"];

            // Validar campos críticos
            if (string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(user) ||
                string.IsNullOrWhiteSpace(pass) ||
                string.IsNullOrWhiteSpace(from) ||
                string.IsNullOrWhiteSpace(to))
            {
                throw new InvalidOperationException("Configuración SMTP incompleta o inválida.");
            }

            // Configurar cliente SMTP
            using var smtp = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, pass),
                EnableSsl = enableSsl
            };

            // Crear mensaje de correo
            var mensaje = new MailMessage(from, to, asunto, cuerpo);
            smtp.Send(mensaje);
        }
    }
}
