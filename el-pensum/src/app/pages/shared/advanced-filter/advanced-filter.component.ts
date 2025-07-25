// ✅ 1. Importamos Output y EventEmitter para la comunicación hijo -> padre
import { Component, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Carrera } from '../../../core/models/carrera.model';
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraService } from '../../../core/services/carrera.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';

@Component({
  selector: 'app-advanced-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.css']
})
export class AdvancedFilterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  compareForm: FormGroup;
  allCarreras: Carrera[] = [];
  allUniversidades: Universidad[] = [];
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
      if (!busqueda) {
        if (opcion === 1) this.universidadesParaCarrera1 = [];
        else this.universidadesParaCarrera2 = [];
      }
    } else {
      const carreraId = this.compareForm.get(`carrera${opcion}Id`)?.value;
      const listaFuente = carreraId 
        ? (opcion === 1 ? this.universidadesParaCarrera1 : this.universidadesParaCarrera2)
        : this.allUniversidades;
      
      this.sugerencias[key].lista = listaFuente.filter(u => 
        u.id != null &&
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

    if (tipo === 'carrera' && item.id) {
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

  closePanel(): void {
    this.close.emit();
  }

  // ✅ ================== MÉTODO ACTUALIZADO ==================
  isCompareDisabled(): boolean {
    const { universidad1Id, universidad2Id, carrera1Id, carrera2Id } = this.compareForm.value;

    // Condición base: siempre se necesitan dos universidades
    if (!universidad1Id || !universidad2Id) {
      return true;
    }

    // Escenario 1: Comparación de universidades (sin carreras)
    const esCompUniversidades = !carrera1Id && !carrera2Id;
    if (esCompUniversidades) {
      // Se deshabilita si las universidades son iguales
      return universidad1Id === universidad2Id;
    }

    // Escenario 2: Comparación de carreras
    // Para comparar carreras, ambas deben estar seleccionadas
    const esCompCarreras = carrera1Id && carrera2Id;
    if (esCompCarreras) {
      // Si las universidades son las mismas...
      if (universidad1Id === universidad2Id) {
        // ...las carreras deben ser diferentes
        return carrera1Id === carrera2Id;
      }
      // Si las universidades son diferentes, la comparación siempre es válida
      return false;
    }

    // Si no se cumple ninguna condición válida (ej: solo una carrera seleccionada)
    return true;
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
    
    this.closePanel();
  }
}