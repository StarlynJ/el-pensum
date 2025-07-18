import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarreraService } from '../../../core/services/carrera.service';
import { Carrera } from '../../../core/models/carrera.model';

@Component({
  selector: 'app-gestionar-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-carreras.component.html',
  styleUrls: ['./gestionar-carreras.component.css']
})
export class GestionarCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  // ✅ CAMBIO AQUÍ: Inicializamos el objeto con todos sus campos
  carreraActual: Carrera = { nombre: '', iconoUrl: '' };
  modoEdicion: boolean = false;
  cargando: boolean = true;
  error: string = '';

  constructor(private carreraService: CarreraService) {}

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    this.cargando = true;
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar carreras.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  guardar(): void {
    if (!this.carreraActual.nombre.trim()) {
      alert('El nombre de la carrera es obligatorio.');
      return;
    }

    if (this.modoEdicion && this.carreraActual.id != null) {
      this.carreraService.actualizarCarrera(this.carreraActual.id, this.carreraActual).subscribe({
        next: () => {
          alert('Carrera actualizada.');
          this.resetFormulario();
          this.cargarCarreras();
        },
        error: (err) => {
          alert('Error al actualizar la carrera.');
          console.error(err);
        }
      });
    } else {
      this.carreraService.crearCarrera(this.carreraActual).subscribe({
        next: () => {
          alert('Carrera creada.');
          this.resetFormulario();
          this.cargarCarreras();
        },
        error: (err) => {
          alert('Error al crear la carrera.');
          console.error(err);
        }
      });
    }
  }

  editar(carrera: Carrera): void {
    this.carreraActual = { ...carrera };
    this.modoEdicion = true;
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Eliminar esta carrera?');
    if (!confirmado) return;

    this.carreraService.eliminarCarrera(id).subscribe({
      next: () => {
        this.carreras = this.carreras.filter(c => c.id !== id);
      },
      error: (err) => {
        alert('Error al eliminar la carrera.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.resetFormulario();
  }

  private resetFormulario(): void {
    // ✅ CAMBIO AQUÍ: Reseteamos el objeto con todos sus campos
    this.carreraActual = { nombre: '', iconoUrl: '' };
    this.modoEdicion = false;
  }
}
