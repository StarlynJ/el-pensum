export interface Universidad {
  id?: number;
  nombre: string;
  pais: string;
  ciudad: string;
  rankingNacional: number;
  rankingMundial: number;
  logoUrl: string;
  imagenesCampus: string[];

  // ✅ CAMPOS NUEVOS
  costoInscripcion: number;
  costoAdmision: number;
  costoCredito: number;
  costoCarnet: number;
}
