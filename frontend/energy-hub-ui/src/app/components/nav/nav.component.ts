
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white shadow-2xl p-4">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-black flex items-center gap-2">
          ⚡ <span>EnergyHub</span>
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
          <button class="hamburger">☰</button>
        </div>
      </div>
    </nav>

    <style>
      nav a.router-link-active {
        background-color: rgba(255,255,255,0.3);
        backdrop-filter: blur(10px);
      }
    </style>
  `
})
export class NavComponent {}

