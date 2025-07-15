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
  carreras: Carrera[] = [];
  universidadesFiltradas: Universidad[] = [];
  
  // Usamos un array para las universidades seleccionadas
  universidadesSeleccionadas: Universidad[] = [];
  
  // Propiedades para los dropdowns
  carreraSeleccionada: Carrera | null = null;
  universidadParaAgregar: Universidad | null = null;

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

  onCarreraSeleccionada(): void {
    if (!this.carreraSeleccionada?.id) return;
    
    // Reseteamos la lista cada vez que se cambia de carrera
    this.universidadesSeleccionadas = [];
    this.universidadParaAgregar = null;

    this.carreraUniversitariaService.getUniversidadesPorCarrera(this.carreraSeleccionada.id)
      .subscribe(universidades => {
        this.universidadesFiltradas = universidades;
      });
  }

  // Método para añadir una universidad a la lista
  agregarUniversidad(): void {
    if (!this.universidadParaAgregar) {
      alert('Por favor, selecciona una universidad para añadir.');
      return;
    }
    if (this.universidadesSeleccionadas.length >= 4) {
      alert('Puedes comparar un máximo de 4 universidades.');
      return;
    }
    if (this.universidadesSeleccionadas.find(u => u.id === this.universidadParaAgregar!.id)) {
      alert('Esa universidad ya ha sido añadida.');
      return;
    }

    this.universidadesSeleccionadas.push(this.universidadParaAgregar);
    this.universidadParaAgregar = null; // Reseteamos el dropdown
  }

  // Método para quitar una universidad de la lista
  quitarUniversidad(idUniversidad: number): void {
    this.universidadesSeleccionadas = this.universidadesSeleccionadas.filter(u => u.id !== idUniversidad);
  }

  comparar(): void {
    if (this.universidadesSeleccionadas.length < 2 || !this.carreraSeleccionada?.nombre) {
      alert('Debes seleccionar entre 2 y 4 universidades para comparar.');
      return;
    }

    // Construimos la lista de IDs separados por coma
    const ids = this.universidadesSeleccionadas.map(u => u.id).join(',');
    const slugCarrera = this.slugify(this.carreraSeleccionada.nombre);

    // Navegamos con la nueva ruta
    this.router.navigate([`/comparar/${ids}/${slugCarrera}`]);
  }

  private slugify(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}

