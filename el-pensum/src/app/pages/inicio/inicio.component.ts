import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormularioCompararComponent } from '../comparar/formulario-comparar/formulario-comparar.component';
import { AdvancedFilterComponent } from '../shared/advanced-filter/advanced-filter.component';
import { ContenidoInicioService } from '../../core/services/contenido-inicio.service';
import { ContenidoInicio } from '../../core/models/contenido-inicio.model';
import { forkJoin } from 'rxjs';
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
export class InicioComponent implements OnInit, AfterViewInit {
  showAdvancedFilter = false;
  videoSection: ContenidoInicio | null = null;
  isLoading = true;
  safeVideoUrl: SafeResourceUrl | null = null;
  universidades: Universidad[] = [];

  testimonios = [
    {
      nombre: 'Sofía Peralta',
      texto: '¡Increíble! Pude comparar el pénsum de tres universidades al mismo tiempo. La plataforma me ahorró semanas de investigación y me ayudó a elegir la carrera de software con confianza.'
    },
    {
      nombre: 'Carlos Valdéz',
      texto: 'Tenía dudas entre dos carreras y la asesoría personalizada fue clave. El asesor entendió mis metas y me guió para tomar la mejor decisión. ¡Totalmente recomendado!'
    },
    {
      nombre: 'Laura Jiménez',
      texto: 'La interfaz es súper intuitiva y fácil de usar. Encontrar toda la información sobre las universidades dominicanas en un solo lugar es simplemente genial. ¡Un recurso invaluable!'
    }
  ];
  testimonioActualIndex = 0;
  isFading = false;

  constructor(
    private contenidoService: ContenidoInicioService,
    private sanitizer: DomSanitizer,
    private universidadService: UniversidadService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.cargarContenido();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  cargarContenido(): void {
    this.isLoading = true;
    forkJoin({
      contenido: this.contenidoService.getContenido(),
      universidades: this.universidadService.getUniversidades()
    }).subscribe({
      next: ({ contenido, universidades }) => {
        this.videoSection = contenido;
        this.safeVideoUrl = this.createYoutubeEmbedUrl(contenido.urlVideoLoop);
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

  siguienteTestimonio(): void {
    this.isFading = true;
    setTimeout(() => {
      if (this.testimonioActualIndex < this.testimonios.length - 1) {
        this.testimonioActualIndex++;
      } else {
        this.testimonioActualIndex = 0;
      }
      this.isFading = false;
    }, 200);
  }

  anteriorTestimonio(): void {
    this.isFading = true;
    setTimeout(() => {
      if (this.testimonioActualIndex > 0) {
        this.testimonioActualIndex--;
      } else {
        this.testimonioActualIndex = this.testimonios.length - 1;
      }
      this.isFading = false;
    }, 200);
  }
  
  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    // ✅ MODIFICADO: Se ajusta la lógica del observador
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Si el elemento está entrando en la pantalla, añadimos la clase para animarlo
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // Si el elemento está saliendo de la pantalla, quitamos la clase para que se reinicie
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    const sections = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    sections.forEach((section: Element) => {
      observer.observe(section);
    });
  }
}