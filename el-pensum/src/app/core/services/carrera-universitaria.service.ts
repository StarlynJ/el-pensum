import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';
import { Universidad } from '../models/universidad.model';

// Servicio para manejar la relación carrera-universidad
@Injectable({
  providedIn: 'root'
})
export class CarreraUniversitariaService {
  // URL base de la API
  private apiUrl = 'http://localhost:5265/api/carrerauniversitaria';

  constructor(private http: HttpClient) {}

  // Devuelve los headers con el token (para endpoints protegidos)
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Trae las universidades que tienen una carrera específica
  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.apiUrl}/universidades-por-carrera/${idCarrera}`);
  }

  // Compara la misma carrera en varias universidades
  compararCarreras(universidadIds: number[], carreraNombre: string): Observable<CarreraUniversitaria[]> {
    // Armamos los parámetros para la consulta
    let params = new HttpParams();
    universidadIds.forEach(id => {
      params = params.append('ids', id.toString());
    });
    params = params.set('carrera', carreraNombre);
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