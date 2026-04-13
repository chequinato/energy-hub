
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-600 mx-auto">
            📝
          </div>
          <h2 class="text-xl font-semibold tracking-tight text-center text-slate-100">
            Criar Conta
          </h2>
          <p class="text-xs text-slate-400 text-center">
            Comece a gerenciar sua energia agora
          </p>
          <form class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo</label>
              <input type="text" [(ngModel)]="nome" required name="nome" 
                     class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
              <input type="email" [(ngModel)]="email" required name="email" 
                     class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-500">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Senha</label>
              <input type="password" [(ngModel)]="senha" required name="senha" minlength="6" 
                     class="w-full px-3 py-2 text-xs border border-slate-700 rounded-md bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-500">
            </div>
            <button type="submit" class="w-full inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition-all mt-2">
              Criar Conta
            </button>
          </form>
          <p class="text-center mt-4 text-xs text-slate-400">
            Já tem conta? <a routerLink="/login" class="font-semibold text-emerald-400 hover:text-emerald-300">Entrar agora</a>
          </p>
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

