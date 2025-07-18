import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Universidad } from '../../../core/models/universidad.model';
import { UniversidadService } from '../../../core/services/universidad.service';

@Component({
  selector: 'app-info-universidades',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './info-universidades.component.html',
  styleUrls: ['./info-universidades.component.css']
})
export class InfoUniversidadesComponent implements OnInit {
  universidades: Universidad[] = [];
  isLoading = true;
  error = '';

  // Definimos los campos de la universidad que queremos comparar
  camposDeComparacion = [
    { label: 'País', key: 'pais', tipo: 'texto' },
    { label: 'Ciudad', key: 'ciudad', tipo: 'texto' },
    { label: 'Ranking Nacional', key: 'rankingNacional', tipo: 'texto' },
    { label: 'Ranking Mundial', key: 'rankingMundial', tipo: 'texto' },
    { label: 'Costo Inscripción', key: 'costoInscripcion', tipo: 'moneda' },
    { label: 'Costo Admisión', key: 'costoAdmision', tipo: 'moneda' },
    { label: 'Costo por Crédito', key: 'costoCredito', tipo: 'moneda' },
    { label: 'Costo Carnet', key: 'costoCarnet', tipo: 'moneda' },
  ];

  constructor(
    private route: ActivatedRoute,
    private universidadService: UniversidadService
  ) {}

  ngOnInit(): void {
    const idsString = this.route.snapshot.paramMap.get('ids');

    if (!idsString) {
      this.error = 'No se proporcionaron IDs de universidades para comparar.';
      this.isLoading = false;
      return;
    }

    // Convertimos el string '1,2,3' en un array de números [1, 2, 3]
    const ids = idsString.split(',').map(id => +id);
    
    this.universidadService.compararUniversidades(ids).subscribe({
      next: (data) => {
        this.universidades = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de las universidades.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  obtenerValor(universidad: Universidad, key: string): any {
    const valor = (universidad as any)[key];
    return valor ?? 'N/D';
  }
}