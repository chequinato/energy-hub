import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-8"><h2 class="text-2xl font-bold mb-4">Contratos</h2><p>Em breve: listagem de contratos.</p></div>`
})
export class ContratosPage {}
