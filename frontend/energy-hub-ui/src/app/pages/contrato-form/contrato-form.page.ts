import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 font-sans">
      <div class="max-w-md w-full">
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8 text-center hover:border-slate-600 transition-all">
          <div class="mb-6">
            <div class="text-5xl mb-4">⚙️</div>
            <h2 class="font-display text-2xl font-bold text-slate-100">Formulário de Contrato</h2>
            <p class="text-slate-400 font-light mt-3 text-sm">
              Esta funcionalidade será em breve. Estamos trabalhando para disponibilizá-la!
            </p>
          </div>
          <a routerLink="/contratos" class="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/30 transform hover:scale-105">
            ← Voltar aos Contratos
          </a>
        </div>
      </div>
    </div>
  `
})
export class ContratoFormPage {}
