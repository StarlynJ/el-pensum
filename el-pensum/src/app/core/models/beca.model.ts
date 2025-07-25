// Modelo para una beca (ayuda económica, etc)
export interface Beca {
  id?: number; // Id único (opcional)
  titulo: string; // Nombre de la beca
  resumen: string; // Descripción corta
  imagenUrl: string; // Imagen de la beca
  enlace: string; // Link para más info o aplicar
}