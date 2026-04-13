import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-black flex items-center gap-2 hover:scale-105 transition-all">
          ⚡ EnergyHub
        </a>
        <div class="hidden md:flex items-center gap-6 font-semibold">
          <a routerLink="/" routerLinkActive="active" class="px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            Início
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" class="px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            Dashboard
          </a>
          <a routerLink="/clientes" routerLinkActive="active" class="px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            Clientes
          </a>
          <a routerLink="/contratos" routerLinkActive="active" class="px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            Contratos
          </a>
          <a routerLink="/login" routerLinkActive="active" class="px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
            Login
          </a>
        </div>
        <div class="md:hidden">
          <button class="text-xl">☰</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    a.router-link-active {
      background: rgba(255,255,255,0.2) !important;
      backdrop-filter: blur(10px);
    }
  `]
})
export class NavComponent {}
