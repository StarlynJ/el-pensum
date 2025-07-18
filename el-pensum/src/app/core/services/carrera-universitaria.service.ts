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
   * MÉTODO CORREGIDO
   * Los nombres de los parámetros ('ids' y 'carrera') ahora coinciden
   * con lo que el backend (Swagger) espera.
   */
  compararCarreras(universidadIds: number[], carreraNombre: string): Observable<CarreraUniversitaria[]> {
    const idsString = universidadIds.join(',');

    let params = new HttpParams()
      .set('ids', idsString) // <-- CORREGIDO de 'universidadIds' a 'ids'
      .set('carrera', carreraNombre); // <-- CORREGIDO de 'carreraNombre' a 'carrera'

    const url = `${this.apiUrl}/comparacion`;
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