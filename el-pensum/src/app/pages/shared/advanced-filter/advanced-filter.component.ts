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
      // ✅ CAMBIO: El campo de universidad ahora inicia habilitado
      universidad1Id: [null],
      carrera2Id: [null],
      // ✅ CAMBIO: El campo de universidad ahora inicia habilitado
      universidad2Id: [null]
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
    this.compareForm.get('carrera1Id')?.valueChanges.subscribe(carreraId => {
      // Siempre reseteamos la universidad si cambia la carrera
      this.compareForm.get('universidad1Id')?.reset();
      
      // ✅ CAMBIO: Ya no deshabilitamos el campo de universidad.
      // Si se elige una carrera, filtramos la lista.
      // Si no, el HTML usará la lista completa 'allUniversidades'.
      if (carreraId) {
        this.universidadesParaCarrera1 = []; // Limpiar resultados anteriores
        this.universidadService.getUniversidadesPorCarrera(carreraId)
          .pipe(catchError(() => of([])))
          .subscribe(data => this.universidadesParaCarrera1 = data);
      }
    });

    this.compareForm.get('carrera2Id')?.valueChanges.subscribe(carreraId => {
      // Siempre reseteamos la universidad si cambia la carrera
      this.compareForm.get('universidad2Id')?.reset();

      // ✅ CAMBIO: Lógica simplificada igual que arriba.
      if (carreraId) {
        this.universidadesParaCarrera2 = [];
        this.universidadService.getUniversidadesPorCarrera(carreraId)
          .pipe(catchError(() => of([])))
          .subscribe(data => this.universidadesParaCarrera2 = data);
      }
    });
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  // Tu lógica para deshabilitar el botón ya es correcta. ¡Sin cambios aquí!
  isCompareDisabled(): boolean {
    const value = this.compareForm.value;
    const esCompDirecta = value.universidad1Id && value.universidad2Id && !value.carrera1Id && !value.carrera2Id;
    const esCompCarreras = value.carrera1Id && value.universidad1Id && value.carrera2Id && value.universidad2Id;
    return !(esCompDirecta || esCompCarreras);
  }

  // Tu lógica de envío ya maneja los dos casos. ¡Sin cambios aquí!
  onSubmit(): void {
    if (this.isCompareDisabled()) return;
    
    // Usamos getRawValue() para obtener los valores incluso de campos deshabilitados (aunque ya no lo están)
    const value = this.compareForm.getRawValue();
    let slug = '';
    const esCompDirecta = !value.carrera1Id && !value.carrera2Id;

    if (esCompDirecta) {
      slug = `u${value.universidad1Id}-vs-u${value.universidad2Id}`;
    } else {
      slug = `c${value.carrera1Id}u${value.universidad1Id}-vs-c${value.carrera2Id}u${value.universidad2Id}`;
    }
    
    this.zone.run(() => {
      this.router.navigate(['/avanzado', slug]);
    });
    
    this.toggleFilterVisibility();
  }
}