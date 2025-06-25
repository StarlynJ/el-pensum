import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';

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

  compararCarreras(uni1: number, uni2: number, carrera: string): Observable<CarreraUniversitaria[]> {
    const url = `${this.apiUrl}/comparacion?uni1=${uni1}&uni2=${uni2}&carrera=${encodeURIComponent(carrera)}`;
    return this.http.get<CarreraUniversitaria[]>(url);
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
