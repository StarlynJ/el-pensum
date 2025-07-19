import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private cuService: CarreraUniversitariaService,
    private universidadService: UniversidadService,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.parseSlugAndLoadData(slug);
    } else {
      this.handleError('No se proporcionó información para la comparación.');
    }
  }

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
          // ======================= CAMBIO CLAVE AQUÍ =======================
          // Añadimos un catchError a CADA llamada individual.
          // Si una falla (devuelve 404), la tratamos como un resultado vacío '[]'
          // en lugar de dejar que todo el forkJoin falle.
          detalle1: this.cuService.compararCarreras([comp1.universidadId], carrerasInfo.carrera1.nombre)
            .pipe(catchError(() => of([]))),
          detalle2: this.cuService.compararCarreras([comp2.universidadId], carrerasInfo.carrera2.nombre)
            .pipe(catchError(() => of([])))
          // =================================================================
        });
      }),
      catchError(err => this.handleError(err))
    ).subscribe(finalResult => {
      // Esta lógica ahora funciona perfectamente. Si 'detalle1' o 'detalle2' vienen vacíos,
      // la condición no se cumplirá y se mostrará el error de "información no encontrada".
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

  // ... (el resto del archivo no cambia) ...

  private setupCareerComparisonFields(): void {
    this.gruposDeCampos = [
      { nombre: 'Detalles Académicos', campos: [
        { label: 'Duración (años)', key: 'duracionAnios', tipo: 'texto' },
        { label: 'Total de Créditos', key: 'totalCreditos', tipo: 'texto' },
        { label: 'Pensum (PDF)', key: 'pensumPdf', tipo: 'enlace' }
      ]},
      { nombre: 'Costos (Universidad)', campos: [
        { label: 'Costo Inscripción', key: 'universidad.costoInscripcion', tipo: 'moneda' },
        { label: 'Costo Admisión', key: 'universidad.costoAdmision', tipo: 'moneda' },
        { label: 'Costo por Crédito', key: 'universidad.costoCredito', tipo: 'moneda' },
      ]},
      { nombre: 'Detalles Adicionales', campos: [
        { label: 'Costos Adicionales', key: 'costosAdicionales', tipo: 'texto' }
      ]}
    ];
  }

  private setupUniversityComparisonFields(): void {
    this.gruposDeCampos = [
      { nombre: 'Información General', campos: [
        { label: 'Siglas', key: 'siglas', tipo: 'texto' },
        { label: 'Sitio Web', key: 'website', tipo: 'enlace' }
      ]},
      { nombre: 'Costos Generales', campos: [
        { label: 'Costo Inscripción', key: 'costoInscripcion', tipo: 'moneda' },
        { label: 'Costo Admisión', key: 'costoAdmision', tipo: 'moneda' },
        { label: 'Costo por Crédito', key: 'costoCredito', tipo: 'moneda' },
        { label: 'Costo Carnet', key: 'costoCarnet', tipo: 'moneda' }
      ]}
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