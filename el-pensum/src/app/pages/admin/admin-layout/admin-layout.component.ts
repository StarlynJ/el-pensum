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
  sidebarAbierto = true;
  esPantallaMovil = this.isMobile();

  @HostListener('window:resize', [])
  onResize(): void {
    this.esPantallaMovil = this.isMobile();
    this.sidebarAbierto = !this.esPantallaMovil;
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    if (this.esPantallaMovil) {
      this.sidebarAbierto = false;
    }
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }
}


