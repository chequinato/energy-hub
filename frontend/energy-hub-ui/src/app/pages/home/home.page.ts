
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <!-- Hero -->
      <section class="bg-gradient-to-r from-orange-500 to-purple-600 text-white py-24">
        <div class="max-w-6xl mx-auto px-4 text-center">
          <h1 class="text-6xl md:text-7xl font-bold mb-6">
            ⚡ EnergyHub
          </h1>
          <p class="text-2xl md:text-3xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Sistema de gestão de clientes no mercado livre de energia. 
            Inspirado no que bancos fazem (cadastro, contratos, simulação de economia, dashboard).
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/login" class="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl">
              🚀 Começar
            </a>
            <a routerLink="/dashboard" class="border-2 border-white text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-purple-600 transition-all">
              Ver Dashboard
            </a>
          </div>
        </div>
      </section>

      <!-- Features Cards -->
      <section class="max-w-6xl mx-auto px-4 py-24">
        <h2 class="text-4xl font-bold text-center mb-20 text-gray-800">Como funciona?</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Card 1 -->
          <div class="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-4 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all mx-auto">
              👥
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Clientes</h3>
            <p class="text-gray-600 text-center leading-relaxed">Cadastro completo com CNPJ, consumo médio e região. CRUD completo.</p>
          </div>

          <!-- Card 2 -->
          <div class="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-4 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all mx-auto">
              📄
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Contratos</h3>
            <p class="text-gray-600 text-center leading-relaxed">Vincule contratos aos clientes com fornecedor, preço/MWh e período.</p>
          </div>

          <!-- Card 3 -->
          <div class="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-4 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all mx-auto">
              💰
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Simulação</h3>
            <p class="text-gray-600 text-center leading-relaxed">Calcula economia real: (preço atual - contrato) × consumo = % economia mensal.</p>
          </div>

          <!-- Card 4 -->
          <div class="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-4 border border-gray-100">
            <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all mx-auto">
              📊
            </div>
            <h3 class="text-2xl font-bold mb-4 text-gray-800 text-center">Dashboard</h3>
            <p class="text-gray-600 text-center leading-relaxed">Resumo visual de consumo, contratos ativos e economia projetada.</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="max-w-6xl mx-auto px-4 py-24 bg-white rounded-3xl shadow-2xl mx-8 -mt-12 relative z-10">
        <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">🛠️ Stack Tecnológica</h2>
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              .NET
            </div>
            <h3 class="text-2xl font-bold mb-2">Backend</h3>
            <p class="text-gray-600">.NET 8 + EF Core + MySQL<br>Arquitetura em camadas</p>
          </div>
          <div>
            <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              A
            </div>
            <h3 class="text-2xl font-bold mb-2">Frontend</h3>
            <p class="text-gray-600">Angular 17+ standalone<br>TailwindCSS + modern UI</p>
          </div>
          <div>
            <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              🗄️
            </div>
            <h3 class="text-2xl font-bold mb-2">Banco</h3>
            <p class="text-gray-600">MySQL com entidades Cliente/Contrato/Consumo<br>EF Core migrations</p>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="text-center py-24">
        <h2 class="text-4xl font-bold mb-6 text-gray-800">Pronto para começar?</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Crie sua conta e gerencie seus clientes no mercado livre de energia em minutos.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/register" class="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:scale-105 shadow-2xl transition-all">
            📝 Criar Conta Gratuita
          </a>
          <a routerLink="/dashboard" class="border-4 border-orange-500 text-orange-600 px-12 py-4 rounded-2xl font-bold text-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl">
            Ver Demo →
          </a>
        </div>
      </section>
    </div>
  `
})
export class HomePage { }

