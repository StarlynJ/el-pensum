import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { filter } from 'rxjs';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { FooterComponent } from './pages/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'el-pensum';
  showLayout = true; // Por defecto, mostramos el layout

  constructor(private router: Router) {
    this.router.events.pipe(
      // Nos interesa saber cuándo termina la navegación
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Si la URL después de redirigir comienza con '/admin', ocultamos el layout
      if (event.urlAfterRedirects.startsWith('/admin')) {
        this.showLayout = false;
      } else {
        this.showLayout = true;
      }
    });
  }
}