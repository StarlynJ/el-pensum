import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universidad } from '../models/universidad.model';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  private apiUrl = 'http://localhost:5265/api/universidades';

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUniversidades(): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(this.apiUrl);
  }

  getUniversidad(id: number): Observable<Universidad> {
    return this.http.get<Universidad>(`${this.apiUrl}/${id}`);
  }

  obtenerCarrerasAsignadas(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.apiUrl}/${idUniversidad}/carreras`);
  }

  crearUniversidad(universidad: Universidad): Observable<Universidad> {
    return this.http.post<Universidad>(this.apiUrl, universidad, {
      headers: this.obtenerHeaders()
    });
  }

  actualizarUniversidad(id: number, universidad: Universidad): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, universidad, {
      headers: this.obtenerHeaders()
    });
  }

  eliminarUniversidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }
}





