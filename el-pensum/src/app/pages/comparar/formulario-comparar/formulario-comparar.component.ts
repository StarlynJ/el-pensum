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

  universidad1: Universidad | null = null;
  universidad2: Universidad | null = null;
  carrera: Carrera | null = null;

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
    if (!this.carrera?.id) return;

    this.carreraUniversitariaService.getUniversidadesPorCarrera(this.carrera.id).subscribe(universidades => {
      this.universidadesFiltradas = universidades;
      this.universidad1 = null;
      this.universidad2 = null;
    });
  }

  comparar(): void {
    if (!this.universidad1 || !this.universidad2 || !this.carrera) return;

    const slug1 = this.slugify(this.universidad1.nombre);
    const slug2 = this.slugify(this.universidad2.nombre);
    const slugCarrera = this.slugify(this.carrera.nombre);

    // ✅ Nueva estructura de navegación: /comparar/universidad1/universidad2/carrera
    this.router.navigate([`/comparar/${slug1}/${slug2}/${slugCarrera}`]);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}





