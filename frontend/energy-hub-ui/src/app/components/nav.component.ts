import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 backdrop-blur-xl shadow-2xl">
      <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <!-- Logo -->
        <a routerLink="/home" class="flex items-center gap-2 hover:opacity-90 transition-opacity group">
          <span class="text-3xl group-hover:scale-110 transition-transform">⚡</span>
          <span class="text-xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 transition-all">
            EnergyHub
          </span>
        </a>

        <!-- Navigation -->
        <div class="flex gap-2">
          <a routerLink="/home" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            class="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            🏠 Início
          </a>
          <a routerLink="/dashboard" 
            routerLinkActive="active"
            class="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            📊 Dashboard
          </a>
          <a routerLink="/clientes" 
            routerLinkActive="active"
            class="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            👥 Clientes
          </a>
          <a routerLink="/contratos" 
            routerLinkActive="active"
            class="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all">
            📄 Contratos
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host a.router-link-active {
      @apply bg-slate-800/70 text-white !important;
    }
  `]
})
export class NavComponent {}

