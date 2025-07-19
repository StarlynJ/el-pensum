import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Carrera } from '../../../core/models/carrera.model';
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraService } from '../../../core/services/carrera.service';
import { UniversidadService } from '../../../core/services/universidad.service';
// ✅ 1. Importamos el servicio que nos faltaba
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';

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

  // ✅ 2. Listas para guardar las universidades filtradas por carrera
  universidadesParaCarrera1: Universidad[] = [];
  universidadesParaCarrera2: Universidad[] = [];

  sugerencias = {
    carrera1: { lista: [] as Carrera[], mostrar: false },
    universidad1: { lista: [] as Universidad[], mostrar: false },
    carrera2: { lista: [] as Carrera[], mostrar: false },
    universidad2: { lista: [] as Universidad[], mostrar: false },
  };

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private universidadService: UniversidadService,
    // ✅ 3. Inyectamos el servicio
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router,
    private zone: NgZone
  ) {
    this.compareForm = this.fb.group({
      carrera1Id: [null],
      carrera1Nombre: [''],
      universidad1Id: [null, Validators.required],
      universidad1Nombre: ['', Validators.required],
      
      carrera2Id: [null],
      carrera2Nombre: [''],
      universidad2Id: [null, Validators.required],
      universidad2Nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.carreraService.getCarreras().subscribe(data => this.allCarreras = data);
    this.universidadService.getUniversidades().subscribe(data => this.allUniversidades = data);
  }

  onInput(tipo: 'carrera' | 'universidad', opcion: 1 | 2): void {
    const key = `${tipo}${opcion}` as keyof typeof this.sugerencias;
    const nombreControl = this.compareForm.get(`${tipo}${opcion}Nombre`);
    const idControl = this.compareForm.get(`${tipo}${opcion}Id`);
    const busqueda = nombreControl?.value?.toLowerCase() || '';

    if (tipo === 'carrera') {
      this.sugerencias[key].lista = this.allCarreras.filter(c => 
        c.nombre?.toLowerCase().includes(busqueda)
      );
      // ✅ 4. Si se borra el texto de la carrera, reseteamos la lista de universidades filtradas
      if (!busqueda) {
        if (opcion === 1) this.universidadesParaCarrera1 = [];
        else this.universidadesParaCarrera2 = [];
      }
    } else { // tipo es 'universidad'
      // ✅ 5. Determinamos de qué lista filtrar: la específica de la carrera o la general
      const carreraId = this.compareForm.get(`carrera${opcion}Id`)?.value;
      const listaFuente = carreraId 
        ? (opcion === 1 ? this.universidadesParaCarrera1 : this.universidadesParaCarrera2)
        : this.allUniversidades;
      
      this.sugerencias[key].lista = listaFuente.filter(u => 
        u.nombre?.toLowerCase().includes(busqueda)
      );
    }

    this.sugerencias[key].mostrar = true;
    
    if (idControl?.value) {
      idControl.setValue(null, { emitEvent: false });
    }
  }
  
  seleccionarItem(tipo: 'carrera' | 'universidad', opcion: 1 | 2, item: Carrera | Universidad): void {
    const key = `${tipo}${opcion}` as keyof typeof this.sugerencias;
    const nombreControl = this.compareForm.get(`${tipo}${opcion}Nombre`);
    const idControl = this.compareForm.get(`${tipo}${opcion}Id`);

    nombreControl?.setValue(item.nombre);
    idControl?.setValue(item.id);
    
    this.sugerencias[key].mostrar = false;

    // ✅ 6. Lógica clave: Si se selecciona una carrera, cargamos sus universidades
    if (tipo === 'carrera' && item.id) {
      // Reseteamos la selección de universidad actual
      this.compareForm.get(`universidad${opcion}Nombre`)?.setValue('');
      this.compareForm.get(`universidad${opcion}Id`)?.setValue(null);

      this.carreraUniversitariaService.getUniversidadesPorCarrera(item.id)
        .pipe(catchError(() => of([])))
        .subscribe(data => {
          if (opcion === 1) {
            this.universidadesParaCarrera1 = data;
          } else {
            this.universidadesParaCarrera2 = data;
          }
        });
    }
  }

  onBlur(tipo: 'carrera' | 'universidad', opcion: 1 | 2): void {
    const key = `${tipo}${opcion}` as keyof typeof this.sugerencias;
    setTimeout(() => this.sugerencias[key].mostrar = false, 200);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  isCompareDisabled(): boolean {
    const { universidad1Id, universidad2Id, carrera1Id, carrera2Id } = this.compareForm.value;
    const compUniversidades = universidad1Id && universidad2Id && !carrera1Id && !carrera2Id;
    const compCarreras = carrera1Id && universidad1Id && carrera2Id && universidad2Id;
    
    return !(compUniversidades || compCarreras);
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
      this.router.navigate(['/avanzado', slug]);
    });
    
    this.toggleFilterVisibility();
  }
}