
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 py-12 px-4 font-sans">
      <div class="max-w-md w-full">
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden hover:border-slate-600/80 transition-all">
          <div class="p-8 space-y-6">
            <!-- Icon Header -->
            <div class="flex items-center justify-center">
              <div class="h-16 w-16 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/30">
                🔐
              </div>
            </div>

            <!-- Title -->
            <div class="text-center space-y-2">
              <h2 class="font-display text-2xl font-bold text-slate-100">
                Bem-vindo de volta
              </h2>
              <p class="text-sm text-slate-400 font-light">
                Acesse sua conta EnergyHub
              </p>
            </div>

            <!-- Form -->
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                <input type="email" [(ngModel)]="email" required name="email" placeholder="seu@email.com"
                       class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-600">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
                <input type="password" [(ngModel)]="password" required name="password" placeholder="••••••••"
                       class="w-full px-4 py-3 text-sm border border-slate-700 rounded-lg bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-slate-100 placeholder:text-slate-500 hover:border-slate-600">
              </div>
              <button type="submit" class="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl shadow-sky-500/20 transform hover:scale-105 mt-6">
                Entrar
              </button>
            </form>

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
  `
})
export class LoginPage {
  email = '';
  password = '';
}


