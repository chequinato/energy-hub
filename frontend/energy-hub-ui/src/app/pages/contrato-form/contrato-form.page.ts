import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreateContrato } from '../../models/contrato.model';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4">
      <div class="relative w-full max-w-md">
        <div class="pointer-events-none absolute -inset-6 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-2xl"></div>
        <form (ngSubmit)="salvar()" class="relative eh-card rounded-[28px] p-8 space-y-5">

    <div class="text-center space-y-2">
      <h2 class="font-brand text-2xl font-semibold tracking-[-0.01em] text-slate-100">Novo contrato</h2>
      <p class="text-sm text-slate-400">Crie um contrato vinculando cliente, fornecedor e vigência.</p>
    </div>

    <!-- Fornecedor -->
    <div>
      <label class="text-sm text-slate-400">Fornecedor de energia</label>
      <input [(ngModel)]="form.fornecedor" name="fornecedor"
        placeholder="Ex: EDP, Neoenergia, Engie..."
        class="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
        required />
    </div>

    <!-- Cliente -->
    <div>
      <label class="text-sm text-slate-400">ID do Cliente</label>
      <input [(ngModel)]="form.clienteId" name="clienteId"
        type="number"
        placeholder="Ex: 1"
        class="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
        required />
      <p class="text-xs text-slate-500 mt-1">Use o ID de um cliente já cadastrado</p>
    </div>

    <!-- Preço -->
    <div>
      <label class="text-sm text-slate-400">Preço por MWh (R$)</label>
      <input [(ngModel)]="form.precoMwh" name="precoMwh"
        type="number"
        placeholder="Ex: 250.50"
        class="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
        required />
    </div>

    <!-- Datas -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-sm text-slate-400">Data início</label>
        <input [(ngModel)]="form.dataInicio" name="dataInicio"
          type="date"
          class="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          required />
      </div>

      <div>
        <label class="text-sm text-slate-400">Data fim</label>
        <input [(ngModel)]="form.dataFim" name="dataFim"
          type="date"
          class="w-full mt-2 px-4 py-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          required />
      </div>
    </div>

    <!-- Botão -->
    <button type="submit"
      class="w-full rounded-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 hover:from-emerald-400 hover:to-teal-400 text-white py-3 font-semibold transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(16,185,129,0.55)] hover:scale-[1.01]">
      Salvar contrato
    </button>

    <!-- Voltar -->
    <a routerLink="/contratos" class="block text-center text-slate-400 text-sm hover:text-white transition">
      ← Voltar para contratos
    </a>

  </form>
      </div>
    </div>
  `
})

export class ContratoFormPage {
  private apiService = inject(ApiService);
  private router = inject(Router);

  form: CreateContrato = {
    clienteId: 0,
    precoMwh: 0,
    fornecedor: '',
    dataInicio: '',
    dataFim: ''
  };

  salvar() {
    this.apiService.createContrato(this.form).subscribe({
      next: () => {
        this.router.navigate(['/contratos']);
      },
      error: () => {
        alert('Erro ao criar contrato. Verifique os dados e tente novamente.');
      }
    });
  }
}