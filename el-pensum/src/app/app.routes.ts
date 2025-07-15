import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { CrearUniversidadComponent } from './pages/admin/crear-universidad/crear-universidad.component';
import { ListarUniversidadesComponent } from './pages/admin/listar-universidades/listar-universidades.component';
import { GestionarCarrerasComponent } from './pages/admin/gestionar-carreras/gestionar-carreras.component';
import { GestionarAsignacionesComponent } from './pages/admin/gestionar-asignaciones/gestionar-asignaciones.component';
import { GestionarBecasComponent } from './pages/admin/gestionar-becas/gestionar-becas.component'; // ✅ Importa el componente admin
import { LoginComponent } from './pages/auth/login.component';
import { AuthGuard } from './core/guards/auth.guard';

import { InicioComponent } from './pages/inicio/inicio.component';
import { FormularioCompararComponent } from './pages/comparar/formulario-comparar/formulario-comparar.component';
import { CompararComponent } from './pages/comparar/comparar/comparar.component';
import { AsesoriaComponent } from './pages/asesoria/asesoria.component';
import { BecasComponent } from './pages/becas/becas.component'; // ✅ Importa el componente público

export const routes: Routes = [
  // Rutas públicas
  { path: 'inicio', component: InicioComponent },
  { path: 'comparar', component: FormularioCompararComponent },
  { path: 'comparar/:ids/:slugCarrera', component: CompararComponent },
  { path: 'asesoria', component: AsesoriaComponent },
  { path: 'becas', component: BecasComponent }, // RUTA PÚBLICA NUEVA

  // Rutas protegidas del panel admin
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'universidades', component: ListarUniversidadesComponent },
      { path: 'carreras', component: GestionarCarrerasComponent },
      { path: 'asignaciones', component: GestionarAsignacionesComponent },
      { path: 'becas', component: GestionarBecasComponent }, // RUTA ADMIN NUEVA
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