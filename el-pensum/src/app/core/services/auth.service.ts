import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Servicio para autenticación y manejo de sesión
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de la API de autenticación
  private apiUrl = 'http://localhost:5265/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // Hace login y devuelve el token
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password });
  }

  // Guarda el token en localStorage
  guardarToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Borra el token del localStorage
  eliminarToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Devuelve el token guardado (o null si no hay)
  obtenerToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // ¿Está logueado? (true/false)
  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  // Cierra sesión y redirige al login
  logout(): void {
    this.eliminarToken();
    this.router.navigate(['/login']);
  }
}


