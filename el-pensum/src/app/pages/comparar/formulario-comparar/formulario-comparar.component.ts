import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Universidad } from '../../../core/models/universidad.model';
import { Carrera } from '../../../core/models/carrera.model';

import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';

@Component({
  selector: 'app-formulario-comparar',
  templateUrl: './formulario-comparar.component.html',
  styleUrls: ['./formulario-comparar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioCompararComponent implements OnInit {
  // --- Listas de datos ---
  carreras: Carrera[] = [];
  universidadesDisponibles: Universidad[] = [];
  universidadesSeleccionadas: Universidad[] = [];

  // --- Modelos para la selección (tu lógica original) ---
  carreraSeleccionada: Carrera | null = null;
  universidadParaAgregar: Universidad | null = null;

  // --- Propiedades para el autocompletado ---
  carreraSearchText: string = '';
  universidadSearchText: string = '';
  
  carrerasSugeridas: Carrera[] = [];
  universidadesSugeridas: Universidad[] = [];
  
  showSugerenciasCarrera: boolean = false;
  showSugerenciasUniversidad: boolean = false;

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

  // --- Lógica de autocompletado de Carrera ---
  onCarreraInput(): void {
    if (this.carreraSearchText) {
      this.carrerasSugeridas = this.carreras.filter(c =>
        c.nombre && c.nombre.toLowerCase().includes(this.carreraSearchText.toLowerCase())
      );
      this.showSugerenciasCarrera = this.carrerasSugeridas.length > 0;
    } else {
      this.showSugerenciasCarrera = false;
      this.carrerasSugeridas = [];
    }
    if (this.carreraSeleccionada?.nombre !== this.carreraSearchText) {
        this.carreraSeleccionada = null;
    }
  }

  seleccionarCarrera(carrera: Carrera): void {
    this.carreraSeleccionada = carrera;
    this.carreraSearchText = carrera.nombre;
    this.showSugerenciasCarrera = false;
    this.onCarreraSeleccionada();
  }

  // --- Lógica de autocompletado de Universidad ---
  onUniversidadInput(): void {
    if (this.universidadSearchText) {
      const idsSeleccionados = this.universidadesSeleccionadas.map(u => u.id);
      this.universidadesSugeridas = this.universidadesDisponibles.filter(u =>
        u.nombre && u.nombre.toLowerCase().includes(this.universidadSearchText.toLowerCase()) &&
        !idsSeleccionados.includes(u.id)
      );
      this.showSugerenciasUniversidad = this.universidadesSugeridas.length > 0;
    } else {
      this.showSugerenciasUniversidad = false;
      this.universidadesSugeridas = [];
    }
     if (this.universidadParaAgregar?.nombre !== this.universidadSearchText) {
        this.universidadParaAgregar = null;
    }
  }

  seleccionarUniversidad(universidad: Universidad): void {
    this.universidadParaAgregar = universidad;
    this.universidadSearchText = universidad.nombre;
    this.showSugerenciasUniversidad = false;
  }
  
  // --- Métodos originales (con mínimas adaptaciones) ---
  onCarreraSeleccionada(): void {
    if (!this.carreraSeleccionada?.id) return;
    
    this.universidadesSeleccionadas = [];
    this.universidadParaAgregar = null;
    this.universidadSearchText = '';
    this.universidadSearchText = '';

    this.carreraUniversitariaService.getUniversidadesPorCarrera(this.carreraSeleccionada.id)
      .subscribe(universidades => {
        this.universidadesDisponibles = universidades;
      });
  }

  agregarUniversidad(): void {
    if (!this.universidadParaAgregar) return;
    this.universidadesSeleccionadas.push(this.universidadParaAgregar);
    this.universidadParaAgregar = null;
    this.universidadSearchText = '';
    this.universidadesSugeridas = [];
  }

  quitarUniversidad(idUniversidad: number): void {
    this.universidadesSeleccionadas = this.universidadesSeleccionadas.filter(u => u.id !== idUniversidad);
  }

  // --- ESTE MÉTODO CUMPLE EL "CONTRATO" ---
  comparar(): void {
    if (this.universidadesSeleccionadas.length < 2 || !this.carreraSeleccionada?.id) {
      alert('Debes seleccionar una carrera y entre 2 y 4 universidades para comparar.');
      return;
    }

    // 1. Crea el string de IDs separados por comas (Ej: "4,5")
    const ids = this.universidadesSeleccionadas.map(u => u.id).join(',');
    
    // 2. Crea el slug de la carrera (Ej: "medicina")
    const slugCarrera = this.slugify(this.carreraSeleccionada.nombre);

    // 3. Navega a la ruta que `comparar.component.ts` espera
    this.router.navigate([`/comparar`, ids, slugCarrera]);
  }
  
  private slugify(text: string): string {
    if (!text) return '';
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}