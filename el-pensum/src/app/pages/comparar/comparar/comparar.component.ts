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
  universidades: Universidad[] = [];
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
    const idsString = this.route.snapshot.paramMap.get('ids');
    const slugCarrera = this.route.snapshot.paramMap.get('slugCarrera');

    if (!idsString || !slugCarrera) {
      this.error = 'Faltan parámetros en la URL para realizar la comparación.';
      this.isLoading = false;
      return;
    }

    const ids = idsString.split(',').map(id => +id);
    this.carreraNombre = this.deslugify(slugCarrera);

    // Llamamos al servicio con la nueva firma (un array de IDs y la carrera)
    this.cuService.compararCarreras(ids, this.carreraNombre).subscribe({
      next: (data) => {
        if (data.length < ids.length) {
          this.error = 'No se encontró información para todas las universidades en la carrera seleccionada.';
        }
        // Asignamos los datos para usarlos en el HTML, ordenados y filtrados
        this.comparacion = data.sort((a, b) => ids.indexOf(a.universidadId) - ids.indexOf(b.universidadId));
        this.universidades = this.comparacion.map(c => c.universidad).filter(u => u !== undefined) as Universidad[];
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