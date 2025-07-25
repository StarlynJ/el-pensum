import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universidad } from '../models/universidad.model';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';

// Servicio para manejar universidades (consultar, crear, editar, borrar)
@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  // URL base de la API de universidades
  private apiUrl = 'http://localhost:5265/api/universidades';

  constructor(private http: HttpClient) {}

  // Devuelve los headers con el token (para endpoints protegidos)
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Trae todas las universidades (público)
  getUniversidades(): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(this.apiUrl);
  }

  // Trae una universidad por su id (público)
  getUniversidad(id: number): Observable<Universidad> {
    return this.http.get<Universidad>(`${this.apiUrl}/${id}`);
  }

  // Trae las carreras asignadas a una universidad
  obtenerCarrerasAsignadas(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.apiUrl}/${idUniversidad}/carreras`);
  }

  // Trae universidades que tienen una carrera específica
  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.apiUrl}/por-carrera/${idCarrera}`);
  }

  // Crea una nueva universidad (admin)
  crearUniversidad(universidad: Universidad): Observable<Universidad> {
    return this.http.post<Universidad>(this.apiUrl, universidad, {
      headers: this.obtenerHeaders()
    });
  }

  // Actualiza una universidad existente (admin)
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

  // ✅ NUEVO MÉTODO AÑADIDO
  getUniversidadIdPorNombre(nombre: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/id`, {
      params: { nombre }
    });
  }
}






