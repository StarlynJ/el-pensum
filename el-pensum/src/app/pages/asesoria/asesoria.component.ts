import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsesoriaService } from '../../core/services/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';

@Component({
  selector: 'app-asesoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asesoria.component.html',
  styleUrls: ['./asesoria.component.css']
})
export class AsesoriaComponent {
  asesoria: Asesoria = {
    nombreCompleto: '',
    correo: '',
    carreraInteres: '',
    colegio: '',
    edad: null,
    comentarios: ''
  };

  mensajeExito = '';
  mensajeError = '';

  constructor(private asesoriaService: AsesoriaService) {}

  enviarFormulario(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    this.asesoriaService.enviarAsesoria(this.asesoria).subscribe({
      next: (response) => {
        this.mensajeExito = response.mensaje || '¡Gracias! Hemos recibido tu solicitud de asesoría.';
        this.resetFormulario();
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.';
        console.error(err);
      }
    });
  }

  private resetFormulario(): void {
    this.asesoria = {
      nombreCompleto: '',
      correo: '',
      carreraInteres: '',
      colegio: '',
      edad: null,
      comentarios: ''
    };
  }
}