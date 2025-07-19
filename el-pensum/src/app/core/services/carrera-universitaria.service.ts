import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';
import { Universidad } from '../models/universidad.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraUniversitariaService {
  private apiUrl = 'http://localhost:5265/api/carrerauniversitaria';

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.apiUrl}/universidades-por-carrera/${idCarrera}`);
  }

  /**
   * =================================================================
   * MÉTODO CORREGIDO
   * =================================================================
   */
  compararCarreras(universidadIds: number[], carreraNombre: string): Observable<CarreraUniversitaria[]> {
    // 1. Empezamos con un objeto de parámetros vacío.
    let params = new HttpParams();

    // 2. Iteramos sobre el array de IDs y añadimos cada uno.
    //    HttpClient es lo suficientemente inteligente para crear ?ids=4&ids=6...
    universidadIds.forEach(id => {
      params = params.append('ids', id.toString());
    });

    // 3. Añadimos el parámetro de la carrera.
    params = params.set('carrera', carreraNombre);

    const url = `${this.apiUrl}/comparacion`;
    
    // 4. Hacemos la llamada con los parámetros construidos correctamente.
    return this.http.get<CarreraUniversitaria[]>(url, { params });
  }

  asignarCarrera(asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.post<CarreraUniversitaria>(this.apiUrl, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  actualizarRelacion(id: number, asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.put<CarreraUniversitaria>(`${this.apiUrl}/${id}`, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  eliminarRelacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }

  obtenerCarrerasPorUniversidad(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.apiUrl}/universidad/${idUniversidad}`);
  }

  eliminarAsignacion(idAsignacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idAsignacion}`, {
      headers: this.obtenerHeaders()
    });
  }
}