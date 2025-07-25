import { Routes } from '@angular/router';

// --- Componentes del panel de administración ---
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { ListarUniversidadesComponent } from './pages/admin/listar-universidades/listar-universidades.component';
import { GestionarCarrerasComponent } from './pages/admin/gestionar-carreras/gestionar-carreras.component';
import { GestionarAsignacionesComponent } from './pages/admin/gestionar-asignaciones/gestionar-asignaciones.component';
import { GestionarBecasComponent } from './pages/admin/gestionar-becas/gestionar-becas.component';
import { CrearUniversidadComponent } from './pages/admin/crear-universidad/crear-universidad.component';
import { GestionarContenidoInicioComponent } from './pages/admin/gestionar-contenido-inicio/gestionar-contenido-inicio.component';


// --- Componentes públicos y de autenticación ---
import { LoginComponent } from './pages/auth/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CompararComponent } from './pages/comparar/comparar/comparar.component';
import { AsesoriaComponent } from './pages/asesoria/asesoria.component';
import { BecasComponent } from './pages/becas/becas.component';
import { AdvancedResultsComponent } from './pages/comparar/advanced-results/advanced-results.component';
// ✅ 1. Importamos el nuevo componente de Universidades
import { UniversidadesComponent } from './pages/universidades/universidades.component';


// Definición de rutas principales de la app
export const routes: Routes = [
  // --- Rutas públicas ---
  { path: 'inicio', component: InicioComponent },

  // --- Rutas de comparación (cada una con su propósito) ---
  { path: 'avanzado/:slug', component: AdvancedResultsComponent },
  { path: 'comparar/:ids/:carreraId', component: CompararComponent },

  { path: 'asesoria', component: AsesoriaComponent },
  { path: 'becas', component: BecasComponent },
  // ✅ 2. Añadimos la nueva ruta para la página de Universidades
  { path: 'universidades', component: UniversidadesComponent },

  // --- Rutas protegidas del panel admin ---
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'universidades', component: ListarUniversidadesComponent },
      { path: 'carreras', component: GestionarCarrerasComponent },
      { path: 'asignaciones', component: GestionarAsignacionesComponent },
      { path: 'becas', component: GestionarBecasComponent },
      { path: 'crear-universidad', component: CrearUniversidadComponent },
      { path: 'editar-universidad/:id', component: CrearUniversidadComponent },
      { path: 'contenido-inicio', component: GestionarContenidoInicioComponent },
      { path: '', redirectTo: 'universidades', pathMatch: 'full' }
    ]
  },

  // --- Login y redirecciones globales ---
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];