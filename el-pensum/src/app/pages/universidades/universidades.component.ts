import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf, etc.

// ✅ 1. Importamos los modelos y servicios que usaremos
import { Universidad } from '../../core/models/universidad.model';
import { CarreraUniversitaria } from '../../core/models/carrera-universitaria.model';
import { UniversidadService } from '../../core/services/universidad.service';

@Component({
  selector: 'app-universidades',
  standalone: true,
  // ✅ 2. Añadimos CommonModule a los imports
  imports: [CommonModule],
  templateUrl: './universidades.component.html',
  styleUrls: ['./universidades.component.css']
})
export class UniversidadesComponent implements OnInit {
  // ✅ 3. Propiedades para almacenar los datos y el estado de carga
  universidades: Universidad[] = [];
  isLoading = true;
  error: string | null = null;
  
  // ✅ 4. Propiedades para manejar el modal de detalles
  selectedUniversidad: Universidad | null = null;
  carrerasDeUniversidad: CarreraUniversitaria[] = [];
  isModalVisible = false;

  // ✅ 5. Inyectamos el servicio de universidades
  constructor(private universidadService: UniversidadService) {}

  ngOnInit(): void {
    this.cargarUniversidades();
  }

  cargarUniversidades(): void {
    this.isLoading = true;
    this.universidadService.getUniversidades().subscribe({
      next: (data) => {
        this.universidades = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "No se pudieron cargar las universidades.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // ✅ 6. Métodos para controlar el modal
  openModal(universidad: Universidad): void {
    this.selectedUniversidad = universidad;
    this.isModalVisible = true;
    document.body.classList.add('modal-open'); // Bloquea el scroll del fondo

    // Cargamos las carreras para la universidad seleccionada
    if (universidad.id) {
      this.universidadService.obtenerCarrerasAsignadas(universidad.id).subscribe({
        next: (carreras) => {
          this.carrerasDeUniversidad = carreras;
        },
        error: (err) => {
          console.error('Error al cargar las carreras de la universidad', err);
          this.carrerasDeUniversidad = []; // En caso de error, dejamos la lista vacía
        }
      });
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedUniversidad = null;
    this.carrerasDeUniversidad = [];
    document.body.classList.remove('modal-open'); // Restaura el scroll
  }
}