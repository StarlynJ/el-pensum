import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Carrera } from '../../../core/models/carrera.model';
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraService } from '../../../core/services/carrera.service';
import { UniversidadService } from '../../../core/services/universidad.service';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent implements OnInit {
  isFilterVisible = false;
  compareForm: FormGroup;
  allCarreras: Carrera[] = [];
  allUniversidades: Universidad[] = [];
  universidadesParaCarrera1: Universidad[] = [];
  universidadesParaCarrera2: Universidad[] = [];

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private universidadService: UniversidadService,
    private router: Router,
    private zone: NgZone
  ) {
    this.compareForm = this.fb.group({
      carrera1Id: [null],
      universidad1Id: [{ value: null, disabled: true }],
      carrera2Id: [null],
      universidad2Id: [{ value: null, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormListeners();
  }

  loadInitialData(): void {
    this.carreraService.getCarreras().subscribe(data => this.allCarreras = data);
    this.universidadService.getUniversidades().subscribe(data => this.allUniversidades = data);
  }
 
  setupFormListeners(): void {
    const uni1Control = this.compareForm.get('universidad1Id');
    const uni2Control = this.compareForm.get('universidad2Id');

    this.compareForm.get('carrera1Id')?.valueChanges.subscribe(carreraId => {
      uni1Control?.reset(); 
      if (carreraId) {
        uni1Control?.enable();
        this.universidadesParaCarrera1 = [];
        this.universidadService.getUniversidadesPorCarrera(carreraId)
          .pipe(catchError(() => of([])))
          .subscribe(data => this.universidadesParaCarrera1 = data);
      } else {
        uni1Control?.disable();
      }
    });

    this.compareForm.get('carrera2Id')?.valueChanges.subscribe(carreraId => {
      uni2Control?.reset();
      if (carreraId) {
        uni2Control?.enable();
        this.universidadesParaCarrera2 = [];
        this.universidadService.getUniversidadesPorCarrera(carreraId)
          .pipe(catchError(() => of([])))
          .subscribe(data => this.universidadesParaCarrera2 = data);
      } else {
        uni2Control?.disable();
      }
    });
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  isCompareDisabled(): boolean {
    const value = this.compareForm.value;
    const esCompDirecta = value.universidad1Id && value.universidad2Id && !value.carrera1Id && !value.carrera2Id;
    const esCompCarreras = value.carrera1Id && value.universidad1Id && value.carrera2Id && value.universidad2Id;
    return !(esCompDirecta || esCompCarreras);
  }

  onSubmit(): void {
    if (this.isCompareDisabled()) return;
    const value = this.compareForm.value;
    let slug = '';
    const esCompDirecta = !value.carrera1Id && !value.carrera2Id;
    if (esCompDirecta) {
      slug = `u${value.universidad1Id}-vs-u${value.universidad2Id}`;
    } else {
      slug = `c${value.carrera1Id}u${value.universidad1Id}-vs-c${value.carrera2Id}u${value.universidad2Id}`;
    }
    this.zone.run(() => {
      // --- CAMBIO CLAVE AQUÍ ---
      // Apuntamos a la nueva ruta '/avanzado' que no tiene conflictos.
      this.router.navigate(['/avanzado', slug]);
    });
    this.toggleFilterVisibility();
  }
}