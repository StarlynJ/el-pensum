import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard para proteger rutas: solo deja pasar si el usuario está logueado
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // Si el usuario está autenticado, lo deja pasar; si no, lo manda al login
  canActivate(): boolean {
    if (this.authService.estaAutenticado()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
