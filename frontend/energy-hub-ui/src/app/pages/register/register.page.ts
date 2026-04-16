
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="eh-app flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="relative">
          <div class="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-2xl"></div>
          <div class="relative bg-gradient-to-br from-slate-900/45 to-slate-950/30 border border-slate-800/70 rounded-[28px] shadow-[0_30px_120px_-80px_rgba(16,185,129,0.35)] overflow-hidden ring-1 ring-white/5 backdrop-blur-xl hover:border-slate-700/80 transition-all">
          <div class="p-8 space-y-6">
            <!-- Icon Header -->
            <div class="flex items-center justify-center">
              <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30">
                📝
              </div>
            </div>

            <!-- Title -->
            <div class="text-center space-y-2">
              <h2 class="font-brand text-2xl font-semibold tracking-[-0.01em] text-slate-100">
                Comece Agora
              </h2>
              <p class="text-sm text-slate-400 font-light">
                Crie sua conta EnergyHub gratuitamente
              </p>
            </div>

            <!-- Form -->
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Nome Completo</label>
                <input type="text" [(ngModel)]="nome" required name="nome" placeholder="Seu nome"
                       class="w-full px-4 py-3 text-sm border border-slate-800/70 rounded-xl bg-slate-950/30 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-700/80">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <input type="email" [(ngModel)]="email" required name="email" placeholder="seu@email.com"
                       class="w-full px-4 py-3 text-sm border border-slate-800/70 rounded-xl bg-slate-950/30 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-700/80">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
                <input type="password" [(ngModel)]="senha" required name="senha" minlength="6" placeholder="••••••••"
                       class="w-full px-4 py-3 text-sm border border-slate-800/70 rounded-xl bg-slate-950/30 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-700/80">
              </div>
              <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl shadow-emerald-500/20 transform hover:scale-105 mt-6">
                Criar Conta
              </button>
            </form>

            <!-- Footer -->
            <div class="text-center">
              <p class="text-sm text-slate-400">
                Já tem conta? <a routerLink="/login" class="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Entrar agora</a>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterPage {
  nome = '';
  email = '';
  senha = '';
}

