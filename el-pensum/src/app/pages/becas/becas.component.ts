import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beca } from '../../core/models/beca.model';
import { BecaService } from '../../core/services/beca.service';

// Componente para mostrar la lista de becas disponibles
@Component({
  selector: 'app-becas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './becas.component.html',
  styleUrls: ['./becas.component.css']
})
export class BecasComponent implements OnInit {
  // Lista de becas que se muestran
  becas: Beca[] = [];
  // Estado de carga (loading)
  isLoading = true;
  // Mensaje de error si algo falla
  error = '';

  // Inyectamos el servicio de becas
  constructor(private becaService: BecaService) {}

  // Al iniciar el componente, pedimos las becas al backend
  ngOnInit(): void {
    this.becaService.getBecas().subscribe({
      next: (data) => {
        // Si todo bien, guardamos las becas y quitamos el loading
        this.becas = data;
        this.isLoading = false;
      },
      error: (err) => {
        // Si hay error, mostramos mensaje y quitamos el loading
        this.error = 'No se pudieron cargar las becas en este momento.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}