import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContenidoInicioService } from '../../../core/services/contenido-inicio.service';
import { ContenidoInicio } from '../../../core/models/contenido-inicio.model';

@Component({
  selector: 'app-gestionar-contenido-inicio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Módulo necesario para formularios reactivos
  ],
  templateUrl: './gestionar-contenido-inicio.component.html',
  styleUrls: ['./gestionar-contenido-inicio.component.css']
})
export class GestionarContenidoInicioComponent implements OnInit {

  contenidoForm!: FormGroup;
  isLoading = true;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contenidoService: ContenidoInicioService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario con campos vacíos y validadores
    this.contenidoForm = this.fb.group({
      id: [1], // El ID siempre será 1
      tituloVideo: ['', [Validators.required, Validators.maxLength(100)]],
      textoVideo: ['', [Validators.required, Validators.maxLength(500)]],
      urlVideoLoop: ['', Validators.required],
      urlVideoYoutube: ['', Validators.required],
      urlCanalYoutube: ['', Validators.required]
    });

    // Cargamos los datos actuales desde el backend para llenar el formulario
    this.cargarContenido();
  }

  cargarContenido(): void {
    this.isLoading = true;
    this.contenidoService.getContenido().subscribe({
      next: (data) => {
        this.contenidoForm.patchValue(data); // Llena el formulario con los datos recibidos
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el contenido. Por favor, intente de nuevo.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    // Si el formulario no es válido, no hacemos nada
    if (this.contenidoForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    this.successMessage = null;
    this.errorMessage = null;

    const contenidoActualizado: ContenidoInicio = this.contenidoForm.value;

    this.contenidoService.updateContenido(contenidoActualizado).subscribe({
      next: () => {
        this.successMessage = '¡Contenido actualizado con éxito!';
        // Opcional: ocultar el mensaje después de unos segundos
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.errorMessage = 'Error al guardar los cambios. Por favor, intente de nuevo.';
        console.error(err);
      }
    });
  }
}