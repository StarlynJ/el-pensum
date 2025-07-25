import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beca } from '../models/beca.model';

// Servicio para manejar las becas (consultar, crear, editar, borrar)
@Injectable({
  providedIn: 'root'
})
export class BecaService {
  // URL base de la API de becas
  private apiUrl = 'http://localhost:5265/api/Becas';

  constructor(private http: HttpClient) {}

  // Devuelve los headers con el token (para endpoints protegidos)
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todas las becas (público)
  getBecas(): Observable<Beca[]> {
    return this.http.get<Beca[]>(this.apiUrl);
  }

  // Obtener una beca específica por ID (admin)
  getBeca(id: number): Observable<Beca> {
    return this.http.get<Beca>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  // Crear una nueva beca (admin)
  crearBeca(beca: Beca): Observable<Beca> {
    return this.http.post<Beca>(this.apiUrl, beca, { headers: this.obtenerHeaders() });
  }

  // Actualizar una beca existente (admin)
  actualizarBeca(id: number, beca: Beca): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, beca, { headers: this.obtenerHeaders() });
  }

  // Eliminar una beca (admin)
  eliminarBeca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}