import { Carrera } from './carrera.model';

export interface CarreraUniversitaria {
  id?: number;
  universidadId: number;
  carreraId: number;
  carrera?: Carrera; // 
  duracionAnios: number;
  costoInscripcion: number;
  costoAdmision: number;
  costoCredito: number;
  totalCreditos: number;
  costoCarnet: number;
  pensumPdf: string;
}
