// Componente para el layout de administración (sidebar y contenido)
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  // Controla si el sidebar está abierto o cerrado
  sidebarAbierto = true;
  // Detecta si estamos en móvil
  esPantallaMovil = this.isMobile();

  // Cuando cambia el tamaño de la ventana, ajustamos el sidebar
  @HostListener('window:resize', [])
  onResize(): void {
    this.esPantallaMovil = this.isMobile();
    this.sidebarAbierto = !this.esPantallaMovil;
  }

  // Abre/cierra el sidebar (usado en móvil)
  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  // Cierra el sidebar si estamos en móvil
  cerrarSidebar(): void {
    if (this.esPantallaMovil) {
      this.sidebarAbierto = false;
    }
  }

  // Devuelve true si la pantalla es de móvil
  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}


