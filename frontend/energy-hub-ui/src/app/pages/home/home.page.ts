
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-200 font-sans">

      <!-- HERO -->
      <section class="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center space-y-8">
        <div class="space-y-4">
          <h1 class="font-display text-display-lg font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400">
            ⚡ EnergyHub
          </h1>
          <p class="text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Gerencie com inteligência. Economize com precisão. Controle seu mercado livre de energia.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <a routerLink="/login"
            class="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-sky-500/50 hover:shadow-2xl transform hover:scale-105">
            🚀 Começar Agora
          </a>

          <a routerLink="/dashboard"
            class="border-2 border-slate-600 hover:border-emerald-500 text-slate-200 hover:text-emerald-400 px-8 py-4 rounded-lg font-semibold transition-all hover:bg-emerald-500/5">
            📊 Ver Dashboard
          </a>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800">
        <h2 class="font-display text-display-sm font-bold text-center mb-16 text-slate-100">Recursos Principais</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="group bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 hover:border-sky-500/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20">
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 class="font-display font-semibold text-lg mb-2 text-slate-100">Clientes</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Gerencie CNPJ, consumo mensal e região de cobertura</p>
          </div>

          <div class="group bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 hover:border-emerald-500/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
            <h3 class="font-display font-semibold text-lg mb-2 text-slate-100">Contratos</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Vincule fornecedores, tarifas e datas de vigência</p>
          </div>

          <div class="group bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 hover:border-amber-500/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">💡</div>
            <h3 class="font-display font-semibold text-lg mb-2 text-slate-100">Simulação</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Calcule economia real com análise comparativa</p>
          </div>

          <div class="group bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 hover:border-purple-500/50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 class="font-display font-semibold text-lg mb-2 text-slate-100">Dashboard</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Visualização completa de métricas em tempo real</p>
          </div>
        </div>
      </section>

      <!-- STACK -->
      <section class="max-w-6xl mx-auto px-6 py-20">
        <h2 class="font-display text-display-sm font-bold text-center mb-16 text-slate-100">Tecnologia de Ponta</h2>

        <div class="grid sm:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-700/50 p-8 rounded-2xl text-center hover:border-blue-500 transition-all">
            <p class="text-blue-300 font-display font-bold text-2xl">.NET 8</p>
            <p class="text-sm text-slate-400 mt-3">API robusta com Entity Framework Core</p>
          </div>

          <div class="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-700/50 p-8 rounded-2xl text-center hover:border-purple-500 transition-all">
            <p class="text-purple-300 font-display font-bold text-2xl">Angular 18+</p>
            <p class="text-sm text-slate-400 mt-3">Frontend moderno e responsivo</p>
          </div>

          <div class="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-700/50 p-8 rounded-2xl text-center hover:border-emerald-500 transition-all">
            <p class="text-emerald-300 font-display font-bold text-2xl">MySQL</p>
            <p class="text-sm text-slate-400 mt-3">Persistência de dados confiável</p>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 py-16 mt-20">
        <div class="max-w-4xl mx-auto text-center space-y-6 px-6">
          <h2 class="font-display text-3xl font-bold text-white">Transforme Seu Negócio</h2>
          <p class="text-white/90 text-lg font-light">
            Comece agora a gerenciar seus clientes com a plataforma mais inteligente do mercado.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a routerLink="/register"
              class="bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              📝 Criar Conta Grátis
            </a>

            <a routerLink="/login"
              class="border-2 border-white text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold transition-all">
              🔐 Já tem Conta?
            </a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class HomePage {}
