import { Universidad } from './universidad.model';
import { Carrera } from './carrera.model';

// Relación entre una carrera y una universidad específica
export interface CarreraUniversitaria {
  id?: number; // Id único (opcional)
  universidadId: number; // Id de la universidad
  carreraId: number; // Id de la carrera
  duracionAnios: number; // Cuántos años dura
  totalCreditos: number; // Créditos totales
  pensumPdf: string; // Link al PDF del pensum
  costosAdicionales?: string; // Info extra (ej: costos, exámenes, etc)

  universidad?: Universidad; // Objeto universidad (opcional)
  carrera?: Carrera; // Objeto carrera (opcional)
}