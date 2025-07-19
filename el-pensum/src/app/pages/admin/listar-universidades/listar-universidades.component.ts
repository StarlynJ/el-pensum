import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-universidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-universidades.component.html',
  styleUrls: ['./listar-universidades.component.css']
})
export class ListarUniversidadesComponent implements OnInit {
  // ✅ 1. Lista 'maestra' que nunca cambia y lista filtrada para la tabla
  universidades: Universidad[] = [];
  universidadesFiltradas: Universidad[] = [];
  
  carrerasPorUniversidad: Record<number, CarreraUniversitaria[]> = {};
  mostrarCarreras: { [key: number]: boolean } = {};
  cargando: boolean = true;
  error: string = '';

  // ✅ 2. Propiedad para almacenar el texto del buscador
  terminoBusqueda: string = '';

  constructor(
    private universidadService: UniversidadService,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.universidadService.getUniversidades().subscribe({
      next: (data) => {
        this.universidades = data;
        this.universidadesFiltradas = data; // Inicialmente, la lista filtrada es igual a la completa
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar universidades.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  // ✅ 3. Nuevo método que se activa cada vez que el usuario escribe
  filtrarUniversidades(): void {
    const busqueda = this.terminoBusqueda.toLowerCase();
    this.universidadesFiltradas = this.universidades.filter(uni =>
      uni.nombre.toLowerCase().includes(busqueda)
    );
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar esta universidad?');
    if (!confirmado) return;

    this.universidadService.eliminarUniversidad(id).subscribe({
      next: () => {
        // ✅ 4. Eliminamos de ambas listas para mantener la consistencia
        this.universidades = this.universidades.filter(u => u.id !== id);
        this.universidadesFiltradas = this.universidadesFiltradas.filter(u => u.id !== id);
        delete this.carrerasPorUniversidad[id];
      },
      error: (err) => {
        alert('Error al eliminar la universidad.');
        console.error(err);
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/admin/editar-universidad', id]);
  }

  crearUniversidad(): void {
    this.router.navigate(['/admin/crear-universidad']);
  }

  toggleCarreras(idUniversidad: number): void {
    if (this.mostrarCarreras[idUniversidad]) {
      this.mostrarCarreras[idUniversidad] = false;
      return;
    }

    if (!this.carrerasPorUniversidad[idUniversidad]) {
      this.universidadService.obtenerCarrerasAsignadas(idUniversidad).subscribe({
        next: (carreras) => {
          this.carrerasPorUniversidad[idUniversidad] = carreras;
          this.mostrarCarreras[idUniversidad] = true;
        },
        error: (err) => {
          alert('Error al obtener carreras asignadas.');
          console.error(err);
        }
      });
    } else {
      this.mostrarCarreras[idUniversidad] = true;
    }
  }

  eliminarAsignacion(idUniversidad: number, idAsignacion: number): void {
    const confirmado = confirm('¿Eliminar esta carrera de la universidad?');
    if (!confirmado) return;

    this.carreraUniversitariaService.eliminarAsignacion(idAsignacion).subscribe({
      next: () => {
        this.carrerasPorUniversidad[idUniversidad] = this.carrerasPorUniversidad[idUniversidad]
          .filter(cu => cu.id !== idAsignacion);
      },
      error: (err) => {
        alert('Error al eliminar la asignación.');
        console.error(err);
      }
    });
  }

  getCarreras(idUniversidad: number): CarreraUniversitaria[] {
    return this.carrerasPorUniversidad[idUniversidad] || [];
  }
}



