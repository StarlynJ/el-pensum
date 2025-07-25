import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversidadService } from '../../../core/services/universidad.service';
import { Universidad } from '../../../core/models/universidad.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componente para crear o editar una universidad
@Component({
  selector: 'app-crear-universidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-universidad.component.html',
  styleUrls: ['./crear-universidad.component.css']
})
export class CrearUniversidadComponent implements OnInit {
  // Modelo de universidad que se edita o crea
  universidad: Universidad = {
    id: 0,
    nombre: '',
    pais: '',
    ciudad: '',
    rankingNacional: 0,
    rankingMundial: 0,
    logoUrl: '',
    imagenesCampus: [],
    costoInscripcion: 0,
    costoAdmision: 0,
    costoCredito: 0,
    costoCarnet: 0
  };

  // Id de la universidad (si estamos editando)
  id: number | null = null;
  // true si estamos editando, false si es nueva
  modoEdicion: boolean = false;

  // Inyectamos servicios para navegar y pedir datos
  constructor(
    private universidadService: UniversidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Al iniciar, revisamos si es edición o creación
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.modoEdicion = true;

        // Si es edición, pedimos los datos de la universidad
        this.universidadService.getUniversidad(this.id).subscribe({
          next: (data: Universidad) => {
            this.universidad = data;
          },
          error: (err: any) => {
            console.error('Error al obtener universidad:', err);
          }
        });
      }
    });
  }

  // Guarda los cambios (crea o actualiza)
  guardar(): void {
    if (this.modoEdicion && this.id !== null) {
      this.universidadService.actualizarUniversidad(this.id, this.universidad).subscribe({
        next: () => {
          alert('Universidad actualizada correctamente.');
          this.router.navigate(['/admin/universidades']);
        },
        error: (err: any) => {
          console.error('Error al actualizar universidad:', err);
        }
      });
    } else {
      this.universidadService.crearUniversidad(this.universidad).subscribe({
        next: () => {
          alert('Universidad creada exitosamente.');
          this.router.navigate(['/admin/universidades']);
        },
        error: (err: any) => {
          console.error('Error al crear universidad:', err);
        }
      });
    }
  }

  // Agrega un campo para una nueva imagen del campus
  agregarImagen(): void {
    this.universidad.imagenesCampus.push('');
  }

  // Elimina una imagen del campus
  eliminarImagen(index: number): void {
    this.universidad.imagenesCampus.splice(index, 1);
  }

  cancelar(): void {
    this.router.navigate(['/admin/universidades']);
  }
}



