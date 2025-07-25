import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrera } from '../models/carrera.model';

// Servicio para manejar carreras (consultar, crear, editar, borrar)
@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  // URL base de la API de carreras
  private apiUrl = 'http://localhost:5265/api/carreras';

  constructor(private http: HttpClient) {}

  // Devuelve los headers con el token (para endpoints protegidos)
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Trae todas las carreras (público)
  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }

  // Trae una carrera por su id (público)
  getCarrera(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva carrera (admin)
  crearCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, carrera, {
      headers: this.obtenerHeaders()
    });
  }

  // Actualiza una carrera existente (admin)
  actualizarCarrera(id: number, carrera: Carrera): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, carrera, {
      headers: this.obtenerHeaders()
    });
  }

  // Borra una carrera (admin)
  eliminarCarrera(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }
}
