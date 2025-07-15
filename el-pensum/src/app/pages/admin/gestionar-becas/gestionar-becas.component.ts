import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beca } from '../../../core/models/beca.model';
import { BecaService } from '../../../core/services/beca.service';

@Component({
  selector: 'app-gestionar-becas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-becas.component.html',
  styleUrls: ['./gestionar-becas.component.css']
})
export class GestionarBecasComponent implements OnInit {
  becas: Beca[] = [];
  becaActual: Beca = this.resetBeca();
  modoEdicion = false;
  isLoading = true;
  error = '';

  constructor(private becaService: BecaService) {}

  ngOnInit(): void {
    this.cargarBecas();
  }

  cargarBecas(): void {
    this.isLoading = true;
    this.becaService.getBecas().subscribe({
      next: (data) => {
        this.becas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las becas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  guardar(): void {
    if (this.modoEdicion && this.becaActual.id) {
      // Actualizar beca existente
      this.becaService.actualizarBeca(this.becaActual.id, this.becaActual).subscribe({
        next: () => {
          alert('Beca actualizada correctamente.');
          this.cancelar();
          this.cargarBecas();
        },
        error: (err) => alert('Error al actualizar la beca: ' + err.message)
      });
    } else {
      // Crear nueva beca
      this.becaService.crearBeca(this.becaActual).subscribe({
        next: (becaCreada) => {
          alert('Beca creada exitosamente.');
          this.becas.push(becaCreada);
          this.cancelar();
        },
        error: (err) => alert('Error al crear la beca: ' + err.message)
      });
    }
  }

  editar(beca: Beca): void {
    this.becaActual = { ...beca }; // Copiamos la beca para no modificar la original directamente
    this.modoEdicion = true;
    window.scrollTo(0, 0); // Mover la vista al inicio para ver el formulario
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta beca?')) {
      this.becaService.eliminarBeca(id).subscribe({
        next: () => {
          this.becas = this.becas.filter(b => b.id !== id);
          alert('Beca eliminada.');
        },
        error: (err) => alert('Error al eliminar la beca: ' + err.message)
      });
    }
  }

  cancelar(): void {
    this.becaActual = this.resetBeca();
    this.modoEdicion = false;
  }

  private resetBeca(): Beca {
    return {
      titulo: '',
      resumen: '',
      imagenUrl: '',
      enlace: ''
    };
  }
}