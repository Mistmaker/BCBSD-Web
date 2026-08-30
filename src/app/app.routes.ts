import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes), canActivate: [AuthGuard]
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      {
        path: 'adm',
        loadChildren:() => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule), canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        loadChildren:() => import('./administrativo/administrativo-routing.module').then(m => m.AdministrativoRoutingModule), canActivate: [AuthGuard]
      },
      {
        path: 'sbj',
        loadChildren:() => import('./subjefatura/subjefatura-routing.module').then(m => m.SubjefaturaRoutingModule), canActivate: [AuthGuard]
      },
      {
        path: 'operaciones',
        loadChildren:() => import('./operaciones/operaciones-routing.module').then(m => m.OperacionesRoutingModule), canActivate: [AuthGuard]
      },
      {
        path: 'archivo',
        loadChildren:() => import('./archivo/archivo-routing.module').then(m => m.ArchivoRoutingModule), canActivate: [AuthGuard]
      },
    ], canActivate: [AuthGuard]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'voluntarios',
    loadComponent: () => import('./views/pages/login-voluntarios/login-voluntarios.component').then(m => m.LoginVoluntariosComponent),
    data: {
      title: 'Login Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
