// el-pensum/src/app/core/services/contenido-inicio.service.ts (VERSIÓN CORREGIDA FINAL)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importar HttpHeaders
import { Observable } from 'rxjs';
import { ContenidoInicio } from '../models/contenido-inicio.model';

@Injectable({
  providedIn: 'root'
})
export class ContenidoInicioService {

  // CORRECCIÓN 1: Usando la URL y puerto correctos de tu backend.
  private apiUrl = 'http://localhost:5265/api/ContenidoInicio';

  constructor(private http: HttpClient) { }

  // CORRECCIÓN 2: Añadiendo el método para obtener los headers, idéntico al de tus otros servicios.
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Obtiene el contenido de la página de inicio desde la API (Público).
   * Esta llamada no necesita headers porque el endpoint GET es público.
   */
  getContenido(): Observable<ContenidoInicio> {
    return this.http.get<ContenidoInicio>(this.apiUrl);
  }

  /**
   * Actualiza el contenido de la página de inicio en la API (Protegido).
   */
  updateContenido(contenido: ContenidoInicio): Observable<void> {
    // CORRECCIÓN 3: Pasamos los headers en la petición PUT para que el backend nos autorice.
    return this.http.put<void>(this.apiUrl, contenido, { headers: this.obtenerHeaders() });
  }
}