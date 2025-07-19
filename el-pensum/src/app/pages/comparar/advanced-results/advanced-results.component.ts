// ✅ 1. Importamos HostListener, DomSanitizer y SafeResourceUrl
import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { forkJoin, of, throwError, Observable } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

// Services
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraService } from '../../../core/services/carrera.service';

// Models
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';

@Component({
  selector: 'app-advanced-results',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './advanced-results.component.html',
  styleUrls: ['./advanced-results.component.css']
})
export class AdvancedResultsComponent implements OnInit {
  titulo = 'Comparación Avanzada';
  universidades: Universidad[] = [];
  comparacion: (CarreraUniversitaria | Universidad)[] = [];
  isLoading = true;
  error: string | null = null;
  gruposDeCampos: any[] = [];

  // Propiedades para la galería de imágenes
  isModalVisible = false;
  modalImages: string[] = [];
  currentImageIndex = 0;

  // ✅ 2. Propiedades para el visor de PDF
  isPdfModalVisible = false;
  safePdfUrl: SafeResourceUrl | null = null;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isModalVisible) {
      if (event.key === 'ArrowRight') this.nextImage();
      else if (event.key === 'ArrowLeft') this.prevImage();
      else if (event.key === 'Escape') this.closeModal();
    }
    // ✅ 7. Añadimos el listener para cerrar el modal del PDF con Escape
    if (this.isPdfModalVisible && event.key === 'Escape') {
      this.closePdfModal();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private cuService: CarreraUniversitariaService,
    private universidadService: UniversidadService,
    private carreraService: CarreraService,
    // ✅ 3. Inyectamos el DomSanitizer
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.parseSlugAndLoadData(slug);
    } else {
      this.handleError('No se proporcionó información para la comparación.');
    }
  }

  // --- Métodos para la galería de imágenes ---
  openModal(images: string[], index: number): void {
    if (images && images.length > 0) {
      this.modalImages = images;
      this.currentImageIndex = index;
      this.isModalVisible = true;
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    document.body.classList.remove('modal-open');
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.modalImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.modalImages.length) % this.modalImages.length;
  }

  // ✅ 4. Lógica para abrir el modal del PDF
  openPdfModal(pdfUrl: string): void {
    if (pdfUrl) {
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.isPdfModalVisible = true;
      document.body.classList.add('modal-open');
    }
  }

  // ✅ 5. Lógica para cerrar el modal del PDF
  closePdfModal(): void {
    this.isPdfModalVisible = false;
    this.safePdfUrl = null;
    document.body.classList.remove('modal-open');
  }
  
  // --- El resto de tus métodos permanecen sin cambios ---

  private parseSlugAndLoadData(slug: string): void {
    const uniRegex = /^u(\d+)-vs-u(\d+)$/;
    const uniMatch = slug.match(uniRegex);

    if (uniMatch) {
      const uId1 = parseInt(uniMatch[1], 10);
      const uId2 = parseInt(uniMatch[2], 10);
      this.titulo = 'Comparando Universidades';
      this.setupUniversityComparisonFields();
      this.loadUniversidadesComparison(uId1, uId2);
      return;
    }

    const careerRegex = /^c(\d+)u(\d+)-vs-c(\d+)u(\d+)$/;
    const careerMatch = slug.match(careerRegex);

    if (careerMatch) {
      const dataToLoad = [
        { carreraId: parseInt(careerMatch[1], 10), universidadId: parseInt(careerMatch[2], 10) },
        { carreraId: parseInt(careerMatch[3], 10), universidadId: parseInt(careerMatch[4], 10) }
      ];
      this.setupCareerComparisonFields();
      this.loadCarrerasComparison(dataToLoad);
      return;
    }

    this.handleError('El formato de comparación en la URL es inválido.');
  }

  private loadUniversidadesComparison(uId1: number, uId2: number): void {
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

  private loadCarrerasComparison(data: { carreraId: number, universidadId: number }[]): void {
    const [comp1, comp2] = data;
    forkJoin({
      carrera1: this.carreraService.getCarrera(comp1.carreraId).pipe(catchError(() => of(null))),
      carrera2: this.carreraService.getCarrera(comp2.carreraId).pipe(catchError(() => of(null)))
    }).pipe(
      tap(carrerasInfo => {
        if (carrerasInfo && carrerasInfo.carrera1 && carrerasInfo.carrera2) {
          this.titulo = `Comparando ${carrerasInfo.carrera1.nombre} vs ${carrerasInfo.carrera2.nombre}`;
        } else {
          this.titulo = 'Comparando Carreras';
        }
      }),
      switchMap(carrerasInfo => {
        if (!carrerasInfo || !carrerasInfo.carrera1 || !carrerasInfo.carrera2) {
          return throwError(() => new Error('No se pudieron obtener los datos de una o ambas carreras.'));
        }
        return forkJoin({
          detalle1: this.cuService.compararCarreras([comp1.universidadId], carrerasInfo.carrera1.nombre)
            .pipe(catchError(() => of([]))),
          detalle2: this.cuService.compararCarreras([comp2.universidadId], carrerasInfo.carrera2.nombre)
            .pipe(catchError(() => of([])))
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
        this.handleError('No se encontró la información completa para una o ambas selecciones. Verifica que la carrera exista en la universidad indicada.');
      }
    });
  }

  private setupCareerComparisonFields(): void {
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

  private setupUniversityComparisonFields(): void {
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
  
  obtenerValor(item: any, key: string): any {
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

  private handleError(message: any): Observable<null> {
    this.error = typeof message === 'string' ? message : (message?.message || 'Ocurrió un error inesperado.');
    this.isLoading = false;
    console.error('Error en AdvancedResultsComponent:', message);
    return of(null);
  }
}