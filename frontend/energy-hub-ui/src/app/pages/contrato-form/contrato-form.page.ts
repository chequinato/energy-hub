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
    <div class="min-h-screen flex items-center justify-center bg-slate-900 p-6">
  <form (ngSubmit)="salvar()" class="bg-slate-800 p-6 rounded-xl w-full max-w-md space-y-5">

    <h2 class="text-xl text-white font-bold">Novo Contrato</h2>

    <!-- Fornecedor -->
    <div>
      <label class="text-sm text-slate-400">Fornecedor de energia</label>
      <input [(ngModel)]="form.fornecedor" name="fornecedor"
        placeholder="Ex: EDP, Neoenergia, Engie..."
        class="w-full mt-1 p-2 rounded bg-slate-700 text-white"
        required />
    </div>

    <!-- Cliente -->
    <div>
      <label class="text-sm text-slate-400">ID do Cliente</label>
      <input [(ngModel)]="form.clienteId" name="clienteId"
        type="number"
        placeholder="Ex: 1"
        class="w-full mt-1 p-2 rounded bg-slate-700 text-white"
        required />
      <p class="text-xs text-slate-500 mt-1">Use o ID de um cliente já cadastrado</p>
    </div>

    <!-- Preço -->
    <div>
      <label class="text-sm text-slate-400">Preço por MWh (R$)</label>
      <input [(ngModel)]="form.precoMwh" name="precoMwh"
        type="number"
        placeholder="Ex: 250.50"
        class="w-full mt-1 p-2 rounded bg-slate-700 text-white"
        required />
    </div>

    <!-- Datas -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-sm text-slate-400">Data início</label>
        <input [(ngModel)]="form.dataInicio" name="dataInicio"
          type="date"
          class="w-full mt-1 p-2 rounded bg-slate-700 text-white"
          required />
      </div>

      <div>
        <label class="text-sm text-slate-400">Data fim</label>
        <input [(ngModel)]="form.dataFim" name="dataFim"
          type="date"
          class="w-full mt-1 p-2 rounded bg-slate-700 text-white"
          required />
      </div>
    </div>

    <!-- Botão -->
    <button type="submit"
      class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded font-semibold">
      Salvar contrato
    </button>

    <!-- Voltar -->
    <a routerLink="/contratos" class="block text-center text-slate-400 text-sm hover:text-white transition">
      ← Voltar para contratos
    </a>

  </form>
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