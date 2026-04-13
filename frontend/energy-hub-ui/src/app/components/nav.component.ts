import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gradient-to-r from-orange-500 to-purple-600 shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <a routerLink="/home" class="text-2xl font-bold text-white flex items-center gap-2">
            ⚡ EnergyHub
          </a>
          <div class="flex gap-2">
            <a routerLink="/home" routerLinkActive="active" class="px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              🏠 Início
            </a>
            <a routerLink="/dashboard" routerLinkActive="active" class="px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              📊 Dashboard
            </a>
            <a routerLink="/clientes" routerLinkActive="active" class="px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              👥 Clientes
            </a>
            <a routerLink="/contratos" routerLinkActive="active" class="px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
              📄 Contratos
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavComponent {}

