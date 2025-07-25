// Modelo para una universidad
export interface Universidad {
  id?: number; // Id único (opcional)
  nombre: string; // Nombre de la universidad
  pais: string; // País
  ciudad: string; // Ciudad
  rankingNacional: number; // Ranking nacional
  rankingMundial: number; // Ranking mundial
  logoUrl: string; // Logo de la universidad
  imagenesCampus: string[]; // Fotos del campus

  costoInscripcion: number; // Costo de inscripción
  costoAdmision: number; // Costo de admisión
  costoCredito: number; // Costo por crédito
  costoCarnet: number; // Costo del carnet
}
