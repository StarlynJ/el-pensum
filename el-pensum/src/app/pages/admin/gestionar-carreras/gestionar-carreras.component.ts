
// Importamos lo necesario para el componente, formularios y servicios
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
  // Acá guardamos todas las carreras y las que se muestran (filtradas)
  carreras: Carrera[] = [];
  carrerasFiltradas: Carrera[] = [];

  // Esta es la carrera que estamos editando o creando
  carreraActual: Carrera = { nombre: '', iconoUrl: '' };
  // Si estamos editando o no
  modoEdicion: boolean = false;
  // Para mostrar el spinner de carga
  cargando: boolean = true;
  // Si hay algún error, lo mostramos
  error: string = '';

  // Lo que el usuario escribe para buscar carreras
  terminoBusqueda: string = '';

  // Inyectamos el servicio de carreras
  constructor(private carreraService: CarreraService) {}

  // Cuando se monta el componente, cargamos las carreras
  ngOnInit(): void {
    this.cargarCarreras();
  }

  // Trae todas las carreras del backend
  cargarCarreras(): void {
    this.cargando = true;
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        this.carrerasFiltradas = data; // Inicializamos la lista filtrada
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar carreras.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  // Filtra la lista de carreras según lo que escribe el usuario
  filtrarCarreras(): void {
    const busqueda = this.terminoBusqueda.toLowerCase();
    // Solo dejamos las carreras cuyo nombre incluye el texto buscado
    this.carrerasFiltradas = this.carreras.filter(carrera =>
      carrera.nombre.toLowerCase().includes(busqueda)
    );
  }

  // Guarda una nueva carrera o actualiza una existente
  guardar(): void {
    // Validamos que el nombre no esté vacío
    if (!this.carreraActual.nombre.trim()) {
      alert('El nombre de la carrera es obligatorio.');
      return;
    }

    // Si estamos editando, actualizamos; si no, creamos
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

  // Cuando le das a editar, llenamos el formulario con la carrera seleccionada
  editar(carrera: Carrera): void {
    this.carreraActual = { ...carrera };
    this.modoEdicion = true;
  }

  // Elimina una carrera después de confirmar
  eliminar(id: number): void {
    const confirmado = confirm('¿Eliminar esta carrera?');
    if (!confirmado) return;

    this.carreraService.eliminarCarrera(id).subscribe({
      next: () => {
        // Quitamos la carrera eliminada de ambas listas
        this.carreras = this.carreras.filter(c => c.id !== id);
        this.carrerasFiltradas = this.carrerasFiltradas.filter(c => c.id !== id);
      },
      error: (err) => {
        alert('Error al eliminar la carrera.');
        console.error(err);
      }
    });
  }

  // Cancela la edición y limpia el formulario
  cancelar(): void {
    this.resetFormulario();
  }

  // Resetea el formulario a su estado inicial
  private resetFormulario(): void {
    this.carreraActual = { nombre: '', iconoUrl: '' };
    this.modoEdicion = false;
  }
}