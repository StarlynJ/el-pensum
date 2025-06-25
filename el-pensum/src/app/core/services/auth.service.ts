import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5265/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password });
  }

  guardarToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  eliminarToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

obtenerToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}


  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  logout(): void {
    this.eliminarToken();
    this.router.navigate(['/login']);
  }
}


