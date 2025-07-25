
// Arranque principal de la app Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Aquí se inicia la aplicación con la configuración global
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)); // Si algo falla, lo mostramos en consola
