import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beca } from '../../../core/models/beca.model';
import { BecaService } from '../../../core/services/beca.service';

// Componente para gestionar (crear, editar, eliminar) becas
@Component({
  selector: 'app-gestionar-becas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-becas.component.html',
  styleUrls: ['./gestionar-becas.component.css']
})
export class GestionarBecasComponent implements OnInit {
  // Lista de becas existentes
  becas: Beca[] = [];
  // Beca que se está editando o creando
  becaActual: Beca = this.resetBeca();
  // true si estamos editando, false si es nueva
  modoEdicion = false;
  // Estado de carga
  isLoading = true;
  // Mensaje de error
  error = '';

  // Inyectamos el servicio de becas
  constructor(private becaService: BecaService) {}

  // Al iniciar, cargamos las becas
  ngOnInit(): void {
    this.cargarBecas();
  }

  // Trae todas las becas del backend
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

  // Guarda una beca (crea o actualiza)
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

  // Pone la beca seleccionada en modo edición
  editar(beca: Beca): void {
    this.becaActual = { ...beca }; // Copiamos la beca para no modificar la original directamente
    this.modoEdicion = true;
    window.scrollTo(0, 0); // Mover la vista al inicio para ver el formulario
  }

  // Elimina una beca
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

  // Cancela la edición y limpia el formulario
  cancelar(): void {
    this.becaActual = this.resetBeca();
    this.modoEdicion = false;
  }

  // Devuelve un objeto beca vacío
  private resetBeca(): Beca {
    return {
      titulo: '',
      resumen: '',
      imagenUrl: '',
      enlace: ''
    };
  }
}