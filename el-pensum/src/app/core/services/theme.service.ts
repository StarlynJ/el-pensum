import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    // Usamos Renderer2 para manipular el DOM de forma segura en Angular
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Carga el tema guardado en localStorage o usa el tema del sistema operativo
   * como valor por defecto. Se debe llamar al iniciar la aplicación.
   */
  loadTheme() {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme) {
        this.setTheme(savedTheme);
      } else if (prefersDark) {
        this.setTheme('dark');
      } else {
        this.setTheme('light');
      }
    }
  }

  /**
   * Alterna entre el tema claro y oscuro.
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Aplica un tema específico ('light' o 'dark').
   * @param theme - El tema a aplicar.
   */
  private setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        this.renderer.addClass(document.body, 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark');
      }
    }
  }

  /**
   * Devuelve si el modo oscuro está activo actualmente.
   */
  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }
}