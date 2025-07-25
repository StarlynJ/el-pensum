import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Universidad } from '../../../core/models/universidad.model';
import { Carrera } from '../../../core/models/carrera.model';

import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';

interface UniversitySlot {
  searchText: string;
  suggestions: Universidad[];
  showSuggestions: boolean;
  selectedUniversity: Universidad | null;
}

@Component({
  selector: 'app-formulario-comparar',
  templateUrl: './formulario-comparar.component.html',
  styleUrls: ['./formulario-comparar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioCompararComponent implements OnInit {
  carreras: Carrera[] = [];
  universidadesDisponibles: Universidad[] = [];

  carreraSeleccionada: Carrera | null = null;
  carreraSearchText: string = '';
  carrerasSugeridas: Carrera[] = [];
  showSugerenciasCarrera: boolean = false;

  universitySlots: UniversitySlot[] = [];

  constructor(
    private carreraService: CarreraService,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carreraService.getCarreras().subscribe(carreras => {
      this.carreras = carreras;
    });
  }

  onCarreraInput(): void {
    if (this.carreraSearchText) {
      this.carrerasSugeridas = this.carreras.filter(c =>
        c.nombre && c.nombre.toLowerCase().includes(this.carreraSearchText.toLowerCase())
      );
      this.showSugerenciasCarrera = this.carrerasSugeridas.length > 0;
    } else {
      this.showSugerenciasCarrera = false;
      this.carrerasSugeridas = [];
      this.carreraSeleccionada = null;
      this.universitySlots = [];
    }
  }

  seleccionarCarrera(carrera: Carrera): void {
    this.carreraSeleccionada = carrera;
    this.carreraSearchText = carrera.nombre;
    this.showSugerenciasCarrera = false;
    this.onCarreraSeleccionada();
  }

  onCarreraSeleccionada(): void {
    if (!this.carreraSeleccionada?.id) return;
    
    this.universitySlots = [this.crearSlotVacio(), this.crearSlotVacio()];

    this.carreraUniversitariaService.getUniversidadesPorCarrera(this.carreraSeleccionada.id)
      .subscribe(universidades => {
        this.universidadesDisponibles = universidades;
      });
  }
  
  onUniversidadInput(index: number): void {
    const slot = this.universitySlots[index];
    if (slot.searchText) {
      const idsSeleccionados = this.universitySlots
        .map(s => s.selectedUniversity?.id)
        .filter(id => id != null);

      // ✅ ================== CORRECCIÓN AQUÍ ==================
      // Añadimos 'u.id != null' para asegurar que el ID no sea undefined
      slot.suggestions = this.universidadesDisponibles.filter(u =>
        u.id != null && // <-- Se añade esta comprobación
        u.nombre && u.nombre.toLowerCase().includes(slot.searchText.toLowerCase()) &&
        !idsSeleccionados.includes(u.id)
      );
      slot.showSuggestions = slot.suggestions.length > 0;
    } else {
      slot.showSuggestions = false;
      slot.suggestions = [];
    }
  }

  seleccionarUniversidad(universidad: Universidad, index: number): void {
    this.universitySlots[index].selectedUniversity = universidad;
    this.universitySlots[index].searchText = universidad.nombre;
    this.universitySlots[index].showSuggestions = false;
  }
  
  addUniversitySlot(): void {
    if (this.universitySlots.length < 4) {
      this.universitySlots.push(this.crearSlotVacio());
    }
  }

  private crearSlotVacio(): UniversitySlot {
    return {
      searchText: '',
      suggestions: [],
      showSuggestions: false,
      selectedUniversity: null
    };
  }

  get universidadesSeleccionadasCount(): number {
    return this.universitySlots.filter(s => s.selectedUniversity != null).length;
  }

  quitarUniversidad(universidadId: number): void {
    const slotIndex = this.universitySlots.findIndex(s => s.selectedUniversity?.id === universidadId);
    if (slotIndex > -1) {
      if (this.universitySlots.length > 2) {
        this.universitySlots.splice(slotIndex, 1);
      } else {
        this.universitySlots[slotIndex] = this.crearSlotVacio();
      }
    }
  }

  comparar(): void {
    if (this.universidadesSeleccionadasCount < 2 || !this.carreraSeleccionada?.id) {
      alert('Debes seleccionar una carrera y al menos 2 universidades para comparar.');
      return;
    }

    const ids = this.universitySlots
      .map(s => s.selectedUniversity?.id)
      .filter(id => id != null)
      .join(',');
      
    const carreraId = this.carreraSeleccionada.id;

    this.router.navigate([`/comparar`, ids, carreraId]);
  }
}