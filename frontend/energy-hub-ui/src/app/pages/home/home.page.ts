
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen text-slate-100">

      <!-- HERO -->
      <section class="relative overflow-hidden pt-28 pb-24">
        <!-- glow background (sem bloco sólido) -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>
          <div class="absolute top-10 left-10 w-[350px] h-[350px] bg-blue-500/10 blur-3xl rounded-full"></div>
          <div class="absolute top-20 right-10 w-[350px] h-[350px] bg-emerald-500/10 blur-3xl rounded-full"></div>
        </div>

        <div class="relative max-w-6xl mx-auto px-6 text-center space-y-8">
          
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800/60 bg-slate-900/20 backdrop-blur text-xs">
            <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Plataforma inteligente de energia
          </div>

          <h1 class="font-mono text-5xl md:text-6xl font-semibold tracking-tight">
            EnergyHub
          </h1>

          <p class="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Monitore consumo, detecte desvios e visualize economia com clareza.
          </p>

          <div class="flex justify-center gap-4 pt-4 flex-wrap">
            <a routerLink="/login"
              class="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:opacity-90 transition">
              Começar
            </a>

            <a routerLink="/dashboard"
              class="px-8 py-4 rounded-xl border border-slate-700/60 bg-slate-900/20 backdrop-blur hover:bg-slate-800/30 transition">
              Ver dashboard
            </a>
          </div>

        </div>
      </section>

      <!-- FEATURES -->
      <section class="border-t border-slate-800/60">
        <div class="max-w-6xl mx-auto px-6 py-20">

          <div class="text-center max-w-2xl mx-auto mb-16">
            <h2 class="text-3xl font-semibold tracking-tight text-slate-100">
              Dados claros. Decisões rápidas.
            </h2>
            <p class="text-slate-400 mt-4">
              Visual limpo e direto pra você entender tudo em segundos.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">

            <div class="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur hover:border-cyan-400/40 transition">
              <div class="flex justify-between">
                <div>
                  <p class="text-xs text-slate-400 uppercase">Análise</p>
                  <h3 class="mt-2 font-mono text-lg">Real vs Estimado</h3>
                  <p class="text-sm text-slate-400 mt-2">
                    Compare consumo real com previsão rapidamente.
                  </p>
                </div>
                <span>📊</span>
              </div>
            </div>

            <div class="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur hover:border-emerald-400/40 transition">
              <div class="flex justify-between">
                <div>
                  <p class="text-xs text-slate-400 uppercase">Economia</p>
                  <h3 class="mt-2 font-mono text-lg">Insights financeiros</h3>
                  <p class="text-sm text-slate-400 mt-2">
                    Veja economia gerada pelos contratos.
                  </p>
                </div>
                <span>💰</span>
              </div>
            </div>

            <div class="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur hover:border-amber-400/40 transition">
              <div class="flex justify-between">
                <div>
                  <p class="text-xs text-slate-400 uppercase">Alertas</p>
                  <h3 class="mt-2 font-mono text-lg">Desvios automáticos</h3>
                  <p class="text-sm text-slate-400 mt-2">
                    Detecte consumo fora do padrão.
                  </p>
                </div>
                <span>⚠️</span>
              </div>
            </div>

            <div class="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur hover:border-blue-400/40 transition">
              <div class="flex justify-between">
                <div>
                  <p class="text-xs text-slate-400 uppercase">Performance</p>
                  <h3 class="mt-2 font-mono text-lg">Interface fluida</h3>
                  <p class="text-sm text-slate-400 mt-2">
                    Experiência rápida e responsiva.
                  </p>
                </div>
                <span>⚡</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="border-t border-slate-800/60">
        <div class="max-w-6xl mx-auto px-6 py-20 text-center space-y-6">

          <h3 class="text-3xl font-semibold">
            Bora usar de verdade?
          </h3>

          <p class="text-slate-400 max-w-xl mx-auto">
            Crie sua conta e começa a visualizar seus dados agora.
          </p>

          <div class="flex justify-center gap-4 flex-wrap pt-4">
            <a routerLink="/register"
              class="px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-200 transition">
              Criar conta
            </a>

            <a routerLink="/login"
              class="px-8 py-4 rounded-xl border border-slate-700/60 hover:bg-slate-800/30 transition">
              Entrar
            </a>
          </div>

        </div>
      </section>

    </div>
  `
})
export class HomePage {}