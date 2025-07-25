import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsesoriaService } from '../../core/services/asesoria.service';
import { Asesoria } from '../../core/models/asesoria.model';

// Componente para el formulario de asesoría
@Component({
  selector: 'app-asesoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asesoria.component.html',
  styleUrls: ['./asesoria.component.css']
})
export class AsesoriaComponent {
  // Modelo que se enlaza al formulario
  asesoria: Asesoria = {
    nombreCompleto: '',
    correo: '',
    carreraInteres: '',
    colegio: '',
    edad: null,
    comentarios: ''
  };

  // Mensajes para mostrar feedback al usuario
  mensajeExito = '';
  mensajeError = '';

  // Inyectamos el servicio para enviar la asesoría
  constructor(private asesoriaService: AsesoriaService) {}

  // Envía el formulario al backend
  enviarFormulario(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    this.asesoriaService.enviarAsesoria(this.asesoria).subscribe({
      next: (response) => {
        // Si todo sale bien, mostramos mensaje y limpiamos el form
        this.mensajeExito = response.mensaje || '¡Gracias! Hemos recibido tu solicitud de asesoría.';
        this.resetFormulario();
      },
      error: (err) => {
        // Si hay error, mostramos mensaje de error
        this.mensajeError = err.error?.message || 'Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.';
        console.error(err);
      }
    });
  }

  // Limpia el formulario (deja todo vacío)
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