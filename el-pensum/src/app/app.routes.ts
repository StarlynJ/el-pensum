import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { CrearUniversidadComponent } from './pages/admin/crear-universidad/crear-universidad.component';
import { ListarUniversidadesComponent } from './pages/admin/listar-universidades/listar-universidades.component';
import { GestionarCarrerasComponent } from './pages/admin/gestionar-carreras/gestionar-carreras.component';
import { GestionarAsignacionesComponent } from './pages/admin/gestionar-asignaciones/gestionar-asignaciones.component';
import { LoginComponent } from './pages/auth/login.component';
import { AuthGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      {
        path: 'crear-universidad',
        component: CrearUniversidadComponent
      },
      {
        path: 'editar-universidad/:id',
        component: CrearUniversidadComponent
      },
      {
        path: 'universidades',
        component: ListarUniversidadesComponent
      },
      {
        path: 'carreras',
        component: GestionarCarrerasComponent
      },
      {
        path: 'asignaciones',
        component: GestionarAsignacionesComponent
      },

      {
        path: '',
        redirectTo: 'universidades',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


