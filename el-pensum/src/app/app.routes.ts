import { Routes } from '@angular/router';

// Componentes Admin
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { ListarUniversidadesComponent } from './pages/admin/listar-universidades/listar-universidades.component';
import { GestionarCarrerasComponent } from './pages/admin/gestionar-carreras/gestionar-carreras.component';
import { GestionarAsignacionesComponent } from './pages/admin/gestionar-asignaciones/gestionar-asignaciones.component';
import { GestionarBecasComponent } from './pages/admin/gestionar-becas/gestionar-becas.component';
import { CrearUniversidadComponent } from './pages/admin/crear-universidad/crear-universidad.component';

// Componentes Públicos y de Autenticación
import { LoginComponent } from './pages/auth/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CompararComponent } from './pages/comparar/comparar/comparar.component';
import { AsesoriaComponent } from './pages/asesoria/asesoria.component';
import { BecasComponent } from './pages/becas/becas.component';
import { AdvancedResultsComponent } from './pages/comparar/advanced-results/advanced-results.component';

export const routes: Routes = [
  // Rutas públicas
  { path: 'inicio', component: InicioComponent },
  
  // --- RUTAS DE COMPARACIÓN SEPARADAS Y SIN CONFLICTO ---
  { path: 'avanzado/:slug', component: AdvancedResultsComponent }, // <- RUTA NUEVA Y LIMPIA
  { path: 'comparar/:ids/:slugCarrera', component: CompararComponent }, // <- RUTA ORIGINAL

  { path: 'asesoria', component: AsesoriaComponent },
  { path: 'becas', component: BecasComponent },

  // Rutas protegidas del panel admin
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
      { path: '', redirectTo: 'universidades', pathMatch: 'full' }
    ]
  },

  // Login y redirecciones
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];