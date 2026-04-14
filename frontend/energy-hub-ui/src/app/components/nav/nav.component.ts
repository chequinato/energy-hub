import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 backdrop-blur-xl shadow-2xl">
      <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center font-sans">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity group">
          <span class="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400">⚡</span>
        <span class="text-2xl md:text-3xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 group-hover:scale-105 transition-all">
            EnergyHub
        </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            🏠 Início
          </a>
          <a routerLink="/dashboard" 
            routerLinkActive="active"
            class="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            📊 Dashboard
          </a>
          <a routerLink="/clientes" 
            routerLinkActive="active"
            class="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            👥 Clientes
          </a>
          <a routerLink="/contratos" 
            routerLinkActive="active"
            class="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            📄 Contratos
          </a>
          <a routerLink="/login" 
            class="ml-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-lg transition-all shadow-lg hover:shadow-sky-500/30">
            🔑 Login
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button class="text-2xl text-slate-400 hover:text-white transition-colors">☰</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host a.router-link-active {
      background-color: rgba(30 41 59 / 0.7);
      color: white;
    }
  `]
})
export class NavComponent {}
