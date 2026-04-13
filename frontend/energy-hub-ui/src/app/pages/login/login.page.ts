
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="p-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600 mb-8">
            ⚡
          </div>
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-6">
            Entrar no EnergyHub
          </h2>
          <form class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" [(ngModel)]="email" required name="email" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input type="password" [(ngModel)]="password" required name="password" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 px-4 rounded-xl font-bold text-lg hover:scale-105 shadow-xl transition-all">
              Entrar
            </button>
          </form>
          <p class="text-center mt-6 text-sm text-gray-600">
            Não tem conta? <a routerLink="/register" class="font-semibold text-orange-600 hover:text-orange-500">Criar agora</a>
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


