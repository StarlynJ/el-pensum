// Modelo para la info que manda el usuario cuando pide una asesoría
export interface Asesoria {
  id?: number; // Id único (opcional, lo pone el backend)
  nombreCompleto: string; // Nombre de quien pide ayuda
  correo: string; // Correo de contacto
  carreraInteres: string; // Carrera que le interesa
  colegio: string; // Colegio de donde viene
  edad: number | null; // Edad (puede ser null si no la pone)
  comentarios: string; // Comentarios extra
}