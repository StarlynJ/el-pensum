import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // Controla si el menú móvil está abierto o cerrado
  isMobileMenuOpen = false;

  // Devuelve si el modo oscuro está activo, preguntando al servicio
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  // Inyecta el servicio de tema para manejar el modo oscuro
  constructor(private themeService: ThemeService) {}

  // Alterna el menú móvil (abre/cierra)
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Cierra el menú móvil
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Cambia entre modo claro y oscuro usando el servicio
  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  // Acción para cambiar idioma (aún no implementada)
  toggleLanguage(): void {
    console.log('Language toggle clicked');
  }
}