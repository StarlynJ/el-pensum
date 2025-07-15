import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // ✅ Importa HttpParams
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

  // ✅ Obtener universidades que imparten una carrera específica
  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.apiUrl}/universidades-por-carrera/${idCarrera}`);
  }

  // ✅ CAMBIO: El método ahora acepta un array de números y usa HttpParams
  compararCarreras(ids: number[], carrera: string): Observable<CarreraUniversitaria[]> {
    let params = new HttpParams();
    params = params.append('carrera', carrera);
    
    // Agregamos cada ID al parámetro 'ids'
    ids.forEach(id => {
      params = params.append('ids', id.toString());
    });

    const url = `${this.apiUrl}/comparacion`;
    return this.http.get<CarreraUniversitaria[]>(url, { params: params });
  }

  // ✅ Asignar una carrera a una universidad
  asignarCarrera(asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.post<CarreraUniversitaria>(this.apiUrl, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Actualizar información de una asignación universidad-carrera
  actualizarRelacion(id: number, asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.put<CarreraUniversitaria>(`${this.apiUrl}/${id}`, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Eliminar relación universidad-carrera
  eliminarRelacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Obtener carreras que ofrece una universidad
  obtenerCarrerasPorUniversidad(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.apiUrl}/universidad/${idUniversidad}`);
  }

  // ✅ Eliminar asignación (alias útil)
  eliminarAsignacion(idAsignacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idAsignacion}`, {
      headers: this.obtenerHeaders()
    });
  }
}


