import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent"></div>

      <div class="px-4 sm:px-6 lg:px-8 pt-3">
        <div class="pointer-events-auto mx-auto max-w-7xl">
          <div class="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/40 backdrop-blur-xl shadow-[0_16px_60px_-40px_rgba(34,211,238,0.25)] ring-1 ring-white/5 px-4 sm:px-5 py-3">
            <!-- Brand -->
            <a routerLink="/home" class="flex items-center gap-3 group">
              <span class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border border-cyan-400/20 text-cyan-200 shadow-[0_10px_30px_-18px_rgba(34,211,238,0.55)]">
                ⚡
              </span>
              <div class="leading-tight">
                <div class="text-[13px] uppercase tracking-[0.20em] text-slate-400 font-semibold">EnergyHub</div>
                <div class="text-sm text-slate-200 font-semibold tracking-wide">Gestão inteligente</div>
              </div>
            </a>

            <!-- Links (desktop) -->
            <div class="hidden md:flex items-center gap-1">
              <a
                routerLink="/dashboard"
                routerLinkActive="active"
                class="eh-navlink"
              >Dashboard</a>
              <a
                routerLink="/clientes"
                routerLinkActive="active"
                class="eh-navlink"
              >Clientes</a>
              <a
                routerLink="/consumos"
                routerLinkActive="active"
                class="eh-navlink"
              >Consumo</a>
              <a
                routerLink="/contratos"
                routerLinkActive="active"
                class="eh-navlink"
              >Contratos</a>
            </div>

            <!-- Right side -->
            <div class="flex items-center gap-2 sm:gap-3">
              <!-- Show Login when not authenticated -->
              @if (!isAuthenticated()) {
                <a
                  routerLink="/login"
                  class="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500/90 to-blue-500/90 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 text-sm font-semibold shadow-[0_16px_40px_-30px_rgba(34,211,238,0.75)] transition-all duration-300 hover:shadow-[0_18px_50px_-30px_rgba(59,130,246,0.80)]"
                >
                  Entrar
                </a>

                <!-- Mobile -->
                <a
                  routerLink="/login"
                  class="sm:hidden inline-flex items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900/60 transition-all"
                >
                  Entrar
                </a>
              }

              <!-- Show Logout when authenticated -->
              @if (isAuthenticated()) {
                <div class="h-9 w-[1px] bg-slate-800/70 hidden sm:block"></div>

                <!-- Avatar placeholder -->
                <button
                  type="button"
                  class="group grid h-9 w-9 place-items-center rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/60 ring-1 ring-white/5 transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(148,163,184,0.25)]"
                  aria-label="Usuário"
                >
                  <span class="text-sm font-semibold text-slate-200">👤</span>
                </button>

                <button
                  (click)="onLogout()"
                  class="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500/90 to-orange-500/90 hover:from-red-400 hover:to-orange-400 text-white px-4 py-2 text-sm font-semibold shadow-[0_16px_40px_-30px_rgba(239,68,68,0.75)] transition-all duration-300 hover:shadow-[0_18px_50px_-30px_rgba(251,146,60,0.80)]"
                >
                  Sair
                </button>

                <!-- Mobile logout -->
                <button
                  (click)="onLogout()"
                  class="sm:hidden inline-flex items-center justify-center rounded-xl border border-red-500/80 bg-red-900/40 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-900/60 transition-all"
                >
                  Sair
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host .eh-navlink {
      border-radius: 0.9rem;
      padding: 0.6rem 0.9rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(226, 232, 240, 0.78);
      transition: all 300ms ease;
      position: relative;
    }

    :host .eh-navlink:hover {
      background: rgba(15, 23, 42, 0.35);
      color: white;
      box-shadow: 0 18px 60px -45px rgba(34, 211, 238, 0.30);
      transform: translateY(-1px);
    }

    :host a.router-link-active {
      background: rgba(15, 23, 42, 0.55);
      color: white;
      box-shadow: 0 18px 60px -45px rgba(34, 211, 238, 0.35);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }
  `]
})
export class NavComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
