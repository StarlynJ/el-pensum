import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beca } from '../models/beca.model';

@Injectable({
  providedIn: 'root'
})
export class BecaService {
  private apiUrl = 'http://localhost:5265/api/Becas';

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- Métodos Públicos ---

  // Obtener todas las becas (para la vista pública)
  getBecas(): Observable<Beca[]> {
    return this.http.get<Beca[]>(this.apiUrl);
  }

  // --- Métodos de Administración (Protegidos) ---

  // Obtener una beca específica por ID (para editar)
  getBeca(id: number): Observable<Beca> {
    return this.http.get<Beca>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  // Crear una nueva beca
  crearBeca(beca: Beca): Observable<Beca> {
    return this.http.post<Beca>(this.apiUrl, beca, { headers: this.obtenerHeaders() });
  }

  // Actualizar una beca existente
  actualizarBeca(id: number, beca: Beca): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, beca, { headers: this.obtenerHeaders() });
  }

  // Eliminar una beca
  eliminarBeca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}