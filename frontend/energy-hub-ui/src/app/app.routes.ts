
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'clientes', canActivate: [AuthGuard], loadComponent: () => import('./pages/clientes/clientes.page').then(m => m.ClientesPage) },
  { path: 'clientes/novo', canActivate: [AuthGuard], loadComponent: () => import('./pages/cliente-form/cliente-form.page').then(m => m.ClienteFormPage) },
  { path: 'clientes/:id/editar', canActivate: [AuthGuard], loadComponent: () => import('./pages/cliente-form/cliente-form.page').then(m => m.ClienteFormPage) },
  { path: 'clientes/editar/:id', canActivate: [AuthGuard], loadComponent: () => import('./pages/cliente-form/cliente-form.page').then(m => m.ClienteFormPage) },
  { path: 'contratos', canActivate: [AuthGuard], loadComponent: () => import('./pages/contratos/contratos.page').then(m => m.ContratosPage) },
  { path: 'contratos/novo', canActivate: [AuthGuard], loadComponent: () => import('./pages/contrato-form/contrato-form.page').then(m => m.ContratoFormPage) },
  { path: 'consumos', canActivate: [AuthGuard], loadComponent: () => import('./pages/consumos/consumos.page').then(m => m.ConsumoPage) },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'home', canActivate: [AuthGuard], loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: '**', redirectTo: '/dashboard' }
];

