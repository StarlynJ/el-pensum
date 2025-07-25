import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// Componente para el login de usuario
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Campos del formulario
  username = '';
  password = '';
  error = '';

  // Inyectamos el servicio de auth y el router
  constructor(private authService: AuthService, private router: Router) {}

  // Lógica para hacer login
  login(): void {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Si el login es correcto, guardamos el token y vamos al admin
        this.authService.guardarToken(res.token);
        this.router.navigate(['/admin']);
      },
      error: () => {
        // Si falla, mostramos error
        this.error = 'Credenciales inválidas.';
      }
    });
  }
}
