
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage) },
  { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.page').then(m => m.ClientesPage) },
  { path: 'clientes/novo', loadComponent: () => import('./pages/cliente-form/cliente-form.page').then(m => m.ClienteFormPage) },
  { path: 'clientes/:id/editar', loadComponent: () => import('./pages/cliente-form/cliente-form.page').then(m => m.ClienteFormPage) },
  { path: 'contratos', loadComponent: () => import('./pages/contratos/contratos.page').then(m => m.ContratosPage) },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: '**', redirectTo: '/dashboard' }
];

