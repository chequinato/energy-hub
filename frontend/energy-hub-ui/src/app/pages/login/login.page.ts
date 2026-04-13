
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-sky-600 mx-auto">
            🔐
          </div>
          <h2 class="text-xl font-semibold tracking-tight text-center text-slate-100">
            Entrar no EnergyHub
          </h2>
          <p class="text-xs text-slate-400 text-center">
            Acesse sua conta de gestão de energia
          </p>
          <form class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
              <input type="email" [(ngModel)]="email" required name="email" 
                     class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-100 placeholder:text-slate-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Senha</label>
              <input type="password" [(ngModel)]="password" required name="password" 
                     class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-100 placeholder:text-slate-500">
            </div>
            <button type="submit" class="w-full inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-medium text-white transition-all mt-2">
              Entrar
            </button>
          </form>
          <p class="text-center mt-4 text-xs text-slate-400">
            Não tem conta? <a routerLink="/register" class="font-semibold text-sky-400 hover:text-sky-300">Criar agora</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  email = '';
  password = '';
}


