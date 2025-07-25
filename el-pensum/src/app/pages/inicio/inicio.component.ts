import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormularioCompararComponent } from '../comparar/formulario-comparar/formulario-comparar.component';
import { AdvancedFilterComponent } from '../shared/advanced-filter/advanced-filter.component';
import { ContenidoInicioService } from '../../core/services/contenido-inicio.service';
import { ContenidoInicio } from '../../core/models/contenido-inicio.model';
import { BecaService } from '../../core/services/beca.service';
import { Beca } from '../../core/models/beca.model';
import { forkJoin } from 'rxjs';

// ✅ 1. Importamos el servicio y el modelo de Universidad
import { UniversidadService } from '../../core/services/universidad.service';
import { Universidad } from '../../core/models/universidad.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormularioCompararComponent,
    AdvancedFilterComponent
  ]
})
export class InicioComponent implements OnInit {
  showAdvancedFilter = false;
  videoSection: ContenidoInicio | null = null;
  isLoading = true;
  safeVideoUrl: SafeResourceUrl | null = null;
  becasDestacadas: Beca[] = [];

  // ✅ 2. Nueva propiedad para almacenar todas las universidades
  universidades: Universidad[] = [];

  constructor(
    private contenidoService: ContenidoInicioService,
    private sanitizer: DomSanitizer,
    private becaService: BecaService,
    // ✅ 3. Inyectamos el UniversidadService
    private universidadService: UniversidadService
  ) {}

  ngOnInit(): void {
    this.cargarContenido();
  }

  cargarContenido(): void {
    this.isLoading = true;

    // ✅ 4. Añadimos la llamada a getUniversidades() al forkJoin
    forkJoin({
      contenido: this.contenidoService.getContenido(),
      becas: this.becaService.getBecas(),
      universidades: this.universidadService.getUniversidades()
    }).subscribe({
      next: ({ contenido, becas, universidades }) => {
        // Procesamos el contenido del video
        this.videoSection = contenido;
        this.safeVideoUrl = this.createYoutubeEmbedUrl(contenido.urlVideoLoop);

        // Procesamos las becas
        this.becasDestacadas = becas.slice(-3);
        
        // ✅ 5. Guardamos la lista de universidades
        this.universidades = universidades;
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el contenido de la página de inicio', err);
        this.isLoading = false;
      }
    });
  }

  private createYoutubeEmbedUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;

    try {
        const parts = url.split('/');
        const videoId = parts.pop() || parts.pop();

        if (!videoId) {
            console.error("No se pudo extraer el ID del video de la URL:", url);
            return null;
        }
        
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0`;

        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

    } catch (e) {
      console.error("Error al procesar la URL de YouTube:", e);
      return null;
    }
  }

  toggleAdvancedFilter(): void {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }
}