import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { Universidad } from '../../../core/models/universidad.model';
import { Carrera } from '../../../core/models/carrera.model';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';

@Component({
  selector: 'app-gestionar-asignaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-asignaciones.component.html',
  styleUrls: ['./gestionar-asignaciones.component.css']
})
export class GestionarAsignacionesComponent implements OnInit {
  universidades: Universidad[] = [];
  carreras: Carrera[] = [];

  // ✅ CAMBIO: Objeto actualizado al nuevo modelo
  asignacion: CarreraUniversitaria = {
    universidadId: 0,
    carreraId: 0,
    duracionAnios: 0,
    totalCreditos: 0,
    pensumPdf: '',
    costosAdicionales: '' // Campo nuevo
  };

  constructor(
    private universidadService: UniversidadService,
    private carreraService: CarreraService,
    private carreraUniversitariaService: CarreraUniversitariaService
  ) {}

  ngOnInit(): void {
    this.universidadService.getUniversidades().subscribe({
      next: data => this.universidades = data
    });

    this.carreraService.getCarreras().subscribe({
      next: data => this.carreras = data
    });
  }

  guardar(): void {
    if (this.asignacion.universidadId === 0 || this.asignacion.carreraId === 0) {
      alert('Debe seleccionar universidad y carrera.');
      return;
    }

    this.carreraUniversitariaService.asignarCarrera(this.asignacion).subscribe({
      next: () => {
        alert('Carrera asignada exitosamente.');
        this.reiniciarFormulario();
      },
      error: err => {
        alert('Error al asignar carrera.');
        console.error(err);
      }
    });
  }

  reiniciarFormulario(): void {
    // ✅ CAMBIO: Objeto actualizado al nuevo modelo
    this.asignacion = {
      universidadId: 0,
      carreraId: 0,
      duracionAnios: 0,
      totalCreditos: 0,
      pensumPdf: '',
      costosAdicionales: ''
    };
  }
}
