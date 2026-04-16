
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="relative">
          <div class="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-emerald-500/10 blur-2xl"></div>
          <div class="relative border border-slate-800/70 rounded-[28px] shadow-[0_30px_120px_-80px_rgba(34,211,238,0.35)] overflow-hidden ring-1 ring-white/5 bg-slate-950/20 backdrop-blur-xl hover:border-slate-700/80 transition-all">
          <div class="p-8 space-y-6">
            <!-- Icon Header -->
            <div class="flex items-center justify-center">
              <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30">
                🔐
              </div>
            </div>

            <!-- Title -->
            <div class="text-center space-y-2">
              <h2 class=" text-2xl font-semibold tracking-[-0.01em] text-slate-100">
                Bem-vindo de volta
              </h2>
              <p class="text-sm text-slate-400 font-light">
                Acesse sua conta EnergyHub
              </p>
            </div>

            <!-- Form -->
            <form class="space-y-4" (ngSubmit)="onLogin()">
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <input type="email" [(ngModel)]="email" required name="email" placeholder="seu@email.com"
                       class="w-full px-4 py-3 text-sm border border-slate-800/70 rounded-xl bg-slate-950/30 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-700/80">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
                <input type="password" [(ngModel)]="password" required name="password" placeholder="••••••••"
                       class="w-full px-4 py-3 text-sm border border-slate-800/70 rounded-xl bg-slate-950/30 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-700/80">
              </div>
              <button
                type="submit"
                [disabled]="loading"
                class="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl shadow-sky-500/20 transform hover:scale-105 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Entrar
              </button>
            </form>

            @if (erroMsg) {
              <div class="eh-card p-3 border-red-500/30 bg-red-500/5 mt-4">
                <p class="text-sm text-red-200 font-semibold tracking-wide">{{ erroMsg }}</p>
              </div>
            }

            <!-- Footer -->
            <div class="text-center">
              <p class="text-sm text-slate-400">
                Não tem conta? <a routerLink="/register" class="font-semibold text-sky-400 hover:text-sky-300 transition-colors">Criar agora</a>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  email = '';
  password = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  erroMsg = '';

  onLogin() {
    if (this.loading) return;

    this.loading = true;
    this.erroMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Erro no login:', err);
        this.loading = false;
        this.erroMsg = err?.error?.message ?? 'Falha ao fazer login. Verifique email e senha.';
      }
    });
  }
}


