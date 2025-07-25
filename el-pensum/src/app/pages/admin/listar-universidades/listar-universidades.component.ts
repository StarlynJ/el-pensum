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
  // Lista principal de universidades y la que se muestra (filtrada)
  universidades: Universidad[] = [];
  universidadesFiltradas: Universidad[] = [];

  // Relaciona cada universidad con sus carreras asignadas
  carrerasPorUniversidad: Record<number, CarreraUniversitaria[]> = {};
  // Controla si se muestran o no las carreras de cada universidad
  mostrarCarreras: { [key: number]: boolean } = {};
  // Para mostrar spinner de carga
  cargando: boolean = true;
  // Mensaje de error si algo sale mal
  error: string = '';

  // Texto que escribe el usuario para buscar universidades
  terminoBusqueda: string = '';


  // Inyectamos los servicios y el router
  constructor(
    private universidadService: UniversidadService,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router
  ) {}

  // Al iniciar, traemos todas las universidades del backend
  ngOnInit(): void {
    this.universidadService.getUniversidades().subscribe({
      next: (data) => {
        this.universidades = data;
        this.universidadesFiltradas = data; // Mostramos todas al inicio
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar universidades.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  // Filtra universidades según lo que escribe el usuario
  filtrarUniversidades(): void {
    const busqueda = this.terminoBusqueda.toLowerCase();
    this.universidadesFiltradas = this.universidades.filter(uni =>
      uni.nombre.toLowerCase().includes(busqueda)
    );
  }

  // Elimina una universidad (pide confirmación antes)
  eliminar(id: number): void {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar esta universidad?');
    if (!confirmado) return;

    this.universidadService.eliminarUniversidad(id).subscribe({
      next: () => {
        // Quitamos la universidad de ambas listas y borramos sus carreras
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

  // Navega a la pantalla de edición de universidad
  editar(id: number): void {
    this.router.navigate(['/admin/editar-universidad', id]);
  }

  // Navega a la pantalla para crear una nueva universidad
  crearUniversidad(): void {
    this.router.navigate(['/admin/crear-universidad']);
  }

  // Muestra u oculta las carreras asignadas a una universidad
  toggleCarreras(idUniversidad: number): void {
    if (this.mostrarCarreras[idUniversidad]) {
      this.mostrarCarreras[idUniversidad] = false;
      return;
    }

    // Si no las hemos traído antes, las pedimos al backend
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

  // Elimina una carrera asignada a la universidad (con confirmación)
  eliminarAsignacion(idUniversidad: number, idAsignacion: number): void {
    const confirmado = confirm('¿Eliminar esta carrera de la universidad?');
    if (!confirmado) return;

    this.carreraUniversitariaService.eliminarAsignacion(idAsignacion).subscribe({
      next: () => {
        // Quitamos la carrera eliminada del array local
        this.carrerasPorUniversidad[idUniversidad] = this.carrerasPorUniversidad[idUniversidad]
          .filter(cu => cu.id !== idAsignacion);
      },
      error: (err) => {
        alert('Error al eliminar la asignación.');
        console.error(err);
      }
    });
  }

  // Devuelve las carreras asignadas a una universidad (o vacío si no hay)
  getCarreras(idUniversidad: number): CarreraUniversitaria[] {
    return this.carrerasPorUniversidad[idUniversidad] || [];
  }
}



