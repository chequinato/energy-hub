import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
        <h2 class="text-xl font-semibold tracking-tight text-slate-100">Formulário de Contrato</h2>
        <p class="text-xs text-slate-400">Em breve: criar/editar contratos</p>
        <a routerLink="/contratos" class="inline-flex items-center justify-center rounded-md bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-medium text-slate-200 transition-all border border-slate-700">
          ← Voltar
        </a>
      </div>
    </div>
  `
})
export class ContratoFormPage {}
