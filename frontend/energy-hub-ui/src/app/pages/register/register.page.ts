
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="p-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 mb-8">
            👤
          </div>
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-6">
            Criar Conta
          </h2>
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input type="text" [(ngModel)]="nome" required name="nome" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" [(ngModel)]="email" required name="email" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input type="password" [(ngModel)]="senha" required name="senha" minlength="6" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
              Criar Conta
            </button>
          </form>
          <p class="text-center mt-6 text-sm text-gray-600">
            Já tem conta? <a routerLink="/login" class="font-semibold text-emerald-600 hover:text-emerald-500">Entrar agora</a>
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

