import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
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
  carreraNombre = '';
  universidad1: Universidad | null = null;
  universidad2: Universidad | null = null;
  
  comparacion: CarreraUniversitaria[] = [];
  isLoading = true;
  error = '';

  gruposDeCampos = [
    {
      nombre: 'Detalles Académicos',
      campos: [
        { label: 'Duración (años)', key: 'duracionAnios', tipo: 'texto' },
        { label: 'Total de Créditos', key: 'totalCreditos', tipo: 'texto' },
        { label: 'Pensum (PDF)', key: 'pensumPdf', tipo: 'enlace' }
      ]
    },
    {
      nombre: 'Costos Generales (Universidad)',
      campos: [
        { label: 'Costo Inscripción', key: 'universidad.costoInscripcion', tipo: 'moneda' },
        { label: 'Costo Admisión', key: 'universidad.costoAdmision', tipo: 'moneda' },
        { label: 'Costo por Crédito', key: 'universidad.costoCredito', tipo: 'moneda' },
        { label: 'Costo Carnet', key: 'universidad.costoCarnet', tipo: 'moneda' }
      ]
    },
    {
      nombre: 'Detalles Adicionales',
      campos: [
        { label: 'Costos Adicionales', key: 'costosAdicionales', tipo: 'texto' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private cuService: CarreraUniversitariaService
  ) {}

  ngOnInit(): void {
    // ✅ CAMBIO: Leemos los IDs directamente de la URL.
    const id1 = this.route.snapshot.paramMap.get('id1');
    const id2 = this.route.snapshot.paramMap.get('id2');
    const slugCarrera = this.route.snapshot.paramMap.get('slugCarrera');

    if (!id1 || !id2 || !slugCarrera) {
      this.error = 'Faltan parámetros en la URL para realizar la comparación.';
      this.isLoading = false;
      return;
    }
    
    this.carreraNombre = this.deslugify(slugCarrera);

    // ✅ CAMBIO: Lógica simplificada. Llamamos directamente al servicio con los IDs.
    // El '+' convierte los strings de la URL a números.
    this.cuService.compararCarreras(+id1, +id2, this.carreraNombre).subscribe({
      next: (data) => {
        if (data.length < 2) {
          this.error = 'No se encontró información para una de las universidades en la carrera seleccionada.';
          this.isLoading = false;
          return;
        }
        // Asignamos los datos completos para usarlos en el HTML
        this.universidad1 = data.find(c => c.universidad?.id === +id1)?.universidad || null;
        this.universidad2 = data.find(c => c.universidad?.id === +id2)?.universidad || null;
        this.comparacion = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Ocurrió un error al cargar los datos de la comparación.';
        this.isLoading = false;
        console.error('Error al obtener comparación:', err);
      }
    });
  }

  obtenerValor(item: CarreraUniversitaria, key: string): any {
    if (!item) return 'N/D';

    const keys = key.split('.');
    let valor: any = item;
    for (const k of keys) {
      if (valor && typeof valor === 'object' && k in valor) {
        valor = valor[k];
      } else {
        return 'N/D';
      }
    }
    return valor ?? 'N/D';
  }

  private deslugify(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}
