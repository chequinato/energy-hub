
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200">

      <!-- HERO -->
      <section class="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <h1 class="text-5xl font-extrabold tracking-tight">
          ⚡ EnergyHub
        </h1>

        <p class="text-slate-400 max-w-2xl mx-auto">
          Gerencie clientes no mercado livre de energia com simplicidade, controle e visão estratégica.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <a routerLink="/login"
            class="bg-sky-500 hover:bg-sky-400 text-slate-900 px-6 py-3 rounded-lg font-semibold transition">
            🚀 Começar agora
          </a>

          <a routerLink="/dashboard"
            class="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg transition">
            📊 Ver Dashboard
          </a>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="max-w-5xl mx-auto px-6 py-12">
        <h2 class="text-2xl font-semibold mb-8 text-center">Recursos principais</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-xl hover:border-sky-500/40 transition">
            <div class="text-3xl mb-3">👥</div>
            <h3 class="font-semibold mb-1">Clientes</h3>
            <p class="text-sm text-slate-400">Gerencie CNPJ, consumo e região</p>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-xl hover:border-sky-500/40 transition">
            <div class="text-3xl mb-3">📄</div>
            <h3 class="font-semibold mb-1">Contratos</h3>
            <p class="text-sm text-slate-400">Vincule fornecedores e tarifas</p>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-xl hover:border-sky-500/40 transition">
            <div class="text-3xl mb-3">💰</div>
            <h3 class="font-semibold mb-1">Simulação</h3>
            <p class="text-sm text-slate-400">Calcule economia real</p>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-xl hover:border-sky-500/40 transition">
            <div class="text-3xl mb-3">📊</div>
            <h3 class="font-semibold mb-1">Dashboard</h3>
            <p class="text-sm text-slate-400">Visualização completa dos dados</p>
          </div>
        </div>
      </section>

      <!-- STACK -->
      <section class="max-w-5xl mx-auto px-6 py-12">
        <h2 class="text-2xl font-semibold mb-8 text-center">Tecnologias</h2>

        <div class="grid sm:grid-cols-3 gap-6">
          <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
            <p class="text-blue-400 font-bold text-xl">.NET 8</p>
            <p class="text-sm text-slate-400 mt-1">API robusta + EF Core</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
            <p class="text-purple-400 font-bold text-xl">Angular</p>
            <p class="text-sm text-slate-400 mt-1">Frontend moderno</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center">
            <p class="text-green-400 font-bold text-xl">MySQL</p>
            <p class="text-sm text-slate-400 mt-1">Persistência de dados</p>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="bg-gradient-to-r from-sky-600 to-emerald-600 py-12 mt-12">
        <div class="max-w-4xl mx-auto text-center space-y-4 px-6">
          <h2 class="text-2xl font-semibold text-white">Pronto pra começar?</h2>
          <p class="text-white/80 text-sm">
            Crie sua conta e comece a gerenciar seus clientes agora mesmo.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a routerLink="/register"
              class="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition">
              📝 Criar Conta
            </a>

            <a routerLink="/login"
              class="border border-white text-white px-6 py-3 rounded-lg hover:bg-white/20 transition">
              🔐 Login
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomePage {}
