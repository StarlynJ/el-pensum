import { Universidad } from './universidad.model';
import { Carrera } from './carrera.model';

export interface CarreraUniversitaria {
  id?: number;
  universidadId: number;
  carreraId: number;
  duracionAnios: number;
  totalCreditos: number;
  pensumPdf: string;
  costosAdicionales?: string;

  // ✅ Añadimos '?' para hacerlas opcionales
  universidad?: Universidad;
  carrera?: Carrera;
}