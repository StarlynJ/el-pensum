// ✅ 1. Importamos HostListener para escuchar eventos del teclado (opcional pero recomendado)
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { forkJoin, of, throwError, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

// Services
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraService } from '../../../core/services/carrera.service';

// Models
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';

@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.component.html',
  styleUrls: ['./comparar.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe]
})
export class CompararComponent implements OnInit {
  carreraNombre = 'Comparación';
  universidades: Universidad[] = [];
  comparacion: (CarreraUniversitaria | Universidad)[] = [];
  isLoading = true;
  error = '';
  gruposDeCampos: any[] = [];

  // ✅ 2. Propiedades para manejar el estado de la galería modal
  isModalVisible = false;
  modalImages: string[] = [];
  currentImageIndex = 0;

  // ✅ 7. Escucha eventos del teclado en toda la ventana
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModalVisible) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeModal();
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cuService: CarreraUniversitariaService,
    private universidadService: UniversidadService,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state && state.mode) {
      this.handleAdvancedComparison(state);
    } else {
      this.loadLegacyComparison();
    }
  }

  // ✅ 3. Lógica para abrir el modal
  openModal(images: string[], index: number): void {
    if (images && images.length > 0) {
      this.modalImages = images;
      this.currentImageIndex = index;
      this.isModalVisible = true;
      document.body.classList.add('modal-open'); // Evita el scroll del fondo
    }
  }

  // ✅ 4. Lógica para cerrar el modal
  closeModal(): void {
    this.isModalVisible = false;
    document.body.classList.remove('modal-open'); // Restaura el scroll
  }

  // ✅ 5. Lógica para ir a la siguiente imagen
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.modalImages.length;
  }

  // ✅ 6. Lógica para ir a la imagen anterior
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.modalImages.length) % this.modalImages.length;
  }
  
  // --- El resto de tus métodos permanecen sin cambios ---

  private handleAdvancedComparison(state: any): void { // ...
    if (state.mode === 'Universidades') {
      this.carreraNombre = 'Comparando Universidades';
      this.setupUniversityComparisonFields();
      this.loadUniversidadesComparison(state.universidadId1, state.universidadId2);
    } else if (state.mode === 'Carreras') {
      this.carreraNombre = 'Comparando Carreras';
      this.setupCareerComparisonFields();
      this.loadCarrerasComparison(state.comparacionData);
    }
  }

  private loadUniversidadesComparison(uId1: number, uId2: number): void { // ...
    forkJoin({
      u1: this.universidadService.getUniversidad(uId1),
      u2: this.universidadService.getUniversidad(uId2)
    }).pipe(catchError(err => this.handleError(err)))
      .subscribe(data => {
        if (data) {
          this.comparacion = [data.u1, data.u2];
          this.universidades = this.comparacion as Universidad[];
          this.isLoading = false;
        }
      });
  }

  private loadCarrerasComparison(data: { carreraId: number, universidadId: number }[]): void { // ...
    const [comp1, comp2] = data;
    forkJoin({
      carrera1: this.carreraService.getCarrera(comp1.carreraId).pipe(catchError(() => of(null))),
      carrera2: this.carreraService.getCarrera(comp2.carreraId).pipe(catchError(() => of(null)))
    }).pipe(
      switchMap(carrerasInfo => {
        if (!carrerasInfo || !carrerasInfo.carrera1 || !carrerasInfo.carrera2) {
          return throwError(() => new Error('No se pudieron obtener los datos de una o ambas carreras.'));
        }
        return forkJoin({
          detalle1: this.cuService.compararCarreras([comp1.universidadId], carrerasInfo.carrera1.nombre),
          detalle2: this.cuService.compararCarreras([comp2.universidadId], carrerasInfo.carrera2.nombre)
        });
      }),
      catchError(err => this.handleError(err))
    ).subscribe(finalResult => {
      if (finalResult && finalResult.detalle1.length > 0 && finalResult.detalle2.length > 0) {
        this.comparacion = [finalResult.detalle1[0], finalResult.detalle2[0]];
        this.universidades = this.comparacion
          .map(c => (c as CarreraUniversitaria).universidad)
          .filter((u): u is Universidad => !!u);
        this.isLoading = false;
      } else if (!this.error) {
        this.handleError(new Error("No se encontró la información completa para la comparación."));
      }
    });
  }

  private loadLegacyComparison(): void { // ...
    this.setupCareerComparisonFields();
    const idsString = this.route.snapshot.paramMap.get('ids');
    const slugCarrera = this.route.snapshot.paramMap.get('slugCarrera');

    if (!idsString || !slugCarrera) {
      this.error = 'Faltan parámetros en la URL para realizar la comparación.';
      this.isLoading = false;
      return;
    }
    const ids = idsString.split(',').map(id => +id);
    this.carreraNombre = this.deslugify(slugCarrera);

    this.cuService.compararCarreras(ids, this.carreraNombre).subscribe({
      next: (data) => {
        if (data.length < ids.length) {
          this.error = 'No se encontró información para todas las universidades en la carrera seleccionada.';
        }
        this.comparacion = data.sort((a, b) => ids.indexOf(a.universidadId) - ids.indexOf(b.universidadId));
        this.universidades = this.comparacion.map(c => (c as CarreraUniversitaria).universidad).filter((u): u is Universidad => !!u);
        this.isLoading = false;
      },
      error: (err) => this.handleError(err, 'Ocurrió un error al cargar los datos de la comparación.')
    });
  }

  obtenerValor(item: any, key: string): any { // ...
    if (!item) return 'N/D';
    const keys = key.split('.');
    let valor: any = item;
    for (const k of keys) {
      if (valor && typeof valor === 'object' && k in valor) {
        valor = valor[k];
      } else { return 'N/D'; }
    }
    return valor ?? 'N/D';
  }

  private deslugify(slug: string): string { // ...
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private handleError(err: any, customMessage?: string): Observable<null> { // ...
    this.error = customMessage || err?.message || 'Ocurrió un error al cargar los datos.';
    this.isLoading = false;
    console.error('Error en CompararComponent:', err);
    return of(null);
  }

  private setupCareerComparisonFields(): void { // ...
    this.gruposDeCampos = [
      {
        nombre: 'Información General',
        campos: [
          { label: 'País', key: 'universidad.pais', tipo: 'texto' },
          { label: 'Ciudad', key: 'universidad.ciudad', tipo: 'texto' },
          { label: 'Ranking Nacional', key: 'universidad.rankingNacional', tipo: 'texto' },
          { label: 'Ranking Mundial', key: 'universidad.rankingMundial', tipo: 'texto' },
        ]
      },
      {
        nombre: 'Detalles Académicos',
        campos: [
          { label: 'Duración (Años)', key: 'duracionAnios', tipo: 'texto' },
          { label: 'Créditos Totales', key: 'totalCreditos', tipo: 'texto' },
          { label: 'Pensum (PDF)', key: 'pensumPdf', tipo: 'enlace' },
        ]
      },
      {
        nombre: 'Costos',
        campos: [
          { label: 'Costo por Crédito', key: 'universidad.costoCredito', tipo: 'moneda' },
          { label: 'Costo de Inscripción', key: 'universidad.costoInscripcion', tipo: 'moneda' },
          { label: 'Costo de Admisión', key: 'universidad.costoAdmision', tipo: 'moneda' },
          { label: 'Costo del Carnet', key: 'universidad.costoCarnet', tipo: 'moneda' },
        ]
      },
      {
        nombre: 'Recursos del Campus',
        campos: [
          { label: 'Imágenes del Campus', key: 'universidad.imagenesCampus', tipo: 'imagenes' },
        ]
      }
    ];
  }

  private setupUniversityComparisonFields(): void { // ...
    this.gruposDeCampos = [
      {
        nombre: 'Información General',
        campos: [
          { label: 'País', key: 'pais', tipo: 'texto' },
          { label: 'Ciudad', key: 'ciudad', tipo: 'texto' },
          { label: 'Ranking Nacional', key: 'rankingNacional', tipo: 'texto' },
          { label: 'Ranking Mundial', key: 'rankingMundial', tipo: 'texto' },
        ]
      },
      {
        nombre: 'Costos Generales',
        campos: [
            { label: 'Costo por Crédito', key: 'costoCredito', tipo: 'moneda' },
            { label: 'Costo de Inscripción', key: 'costoInscripcion', tipo: 'moneda' },
            { label: 'Costo de Admisión', key: 'costoAdmision', tipo: 'moneda' },
            { label: 'Costo del Carnet', key: 'costoCarnet', tipo: 'moneda' },
        ]
      },
      {
        nombre: 'Recursos del Campus',
        campos: [
          { label: 'Imágenes del Campus', key: 'imagenesCampus', tipo: 'imagenes' },
        ]
      }
    ];
  }
}