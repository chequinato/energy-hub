# 🎨 Frontend - Guia de Consumo das Novas APIs

## 📦 Models Angular

Crie estas interfaces no frontend:

```typescript
// models/dashboard.model.ts
export interface ClienteEconomia {
  clienteId: number;
  nomeCliente: string;
  economiaEstimada: number;
  fornecedor: string;
}

export interface Dashboard {
  totalContratos: number;
  totalContratosAtivos: number;
  totalContratosExpirados: number;
  totalContratosFuturos: number;
  totalClientes: number;
  clientesComContratoAtivo: number;
  economiaTotal: number;
  economiaMensal: number;
  topClientesEconomia: ClienteEconomia[];
}

// models/contrato.model.ts
export enum ContratoStatus {
  Futuro = 0,
  Ativo = 1,
  Expirado = 2
}

export interface ContratoDto {
  id: number;
  clienteId: number;
  precoMwh: number;
  fornecedor: string;
  dataInicio: string;  // "YYYY-MM-DD"
  dataFim: string;     // "YYYY-MM-DD"
  status: ContratoStatus;
  statusBadge: string; // "🟢 Ativo", "🔴 Expirado", etc
}

// models/cliente.model.ts
export interface ClienteDetail {
  id: number;
  nome: string;
  cnpj: string;
  consumoMedio: number;
  regiao: string;
  contratoAtivo: ContratoDto | null;
  statusContrato: string;  // "✅ Contrato Ativo", "❌ Sem Contrato"
  economiaEstimada: number;
}

export interface EconomiaSimulacao {
  clienteId: number;
  consumoMwh: number;
  precoAtualMwh: number;
  economiaPercentual: number;
  economiaValor: number;
}
```

---

## 🔌 Services Angular

### DashboardService
```typescript
// services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.apiUrl);
  }
}
```

### ClienteService (Atualizado)
```typescript
// services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteDetail, EconomiaSimulacao } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:5000/api/clientes';

  constructor(private http: HttpClient) {}

  // Nova: Listar clientes com detalhes de contrato ativo
  getClientesComDetalhes(): Observable<ClienteDetail[]> {
    return this.http.get<ClienteDetail[]>(`${this.apiUrl}/com-detalhes`);
  }

  // Nova: Obter detalhes de um cliente específico
  getClienteDetalhes(id: number): Observable<ClienteDetail> {
    return this.http.get<ClienteDetail>(`${this.apiUrl}/${id}/detalhes`);
  }

  // Nova: Simular economia com contrato ativo
  simularEconomiaComContrato(clienteId: number, precoMwh: number): Observable<EconomiaSimulacao> {
    return this.http.post<EconomiaSimulacao>(
      `${this.apiUrl}/${clienteId}/simular-economia`,
      {},
      { params: { precoMercadoAtualMwh: precoMwh.toString() } }
    );
  }
}
```

---

## 🎨 Componentes Angular

### Dashboard Component
```typescript
// components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null;
  loading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.error = 'Falha ao carregar dados do dashboard';
        this.loading = false;
      }
    });
  }
}
```

**Template:**
```html
<!-- dashboard.component.html -->
<div class="dashboard-container" *ngIf="!loading; else loadingTemplate">
  <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

  <div class="stats-grid">
    <!-- Card Contratos Ativos -->
    <div class="stat-card active">
      <div class="stat-value">{{ dashboard?.totalContratosAtivos }}</div>
      <div class="stat-label">🟢 Contratos Ativos</div>
    </div>

    <!-- Card Contratos Expirados -->
    <div class="stat-card expired">
      <div class="stat-value">{{ dashboard?.totalContratosExpirados }}</div>
      <div class="stat-label">🔴 Expirados</div>
    </div>

    <!-- Card Contratos Futuros -->
    <div class="stat-card future">
      <div class="stat-value">{{ dashboard?.totalContratosFuturos }}</div>
      <div class="stat-label">🟡 Futuros</div>
    </div>

    <!-- Card Economia Total -->
    <div class="stat-card economy">
      <div class="stat-value">
        R$ {{ dashboard?.economiaTotal | number:'1.2-2' }}
      </div>
      <div class="stat-label">💰 Economia Total</div>
      <div class="stat-detail">
        R$ {{ dashboard?.economiaMensal | number:'1.2-2' }}/mês
      </div>
    </div>
  </div>

  <!-- TOP 5 Clientes -->
  <div class="top-clientes" *ngIf="dashboard?.topClientesEconomia.length">
    <h3>🏆 TOP 5 Maiores Economias</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Posição</th>
          <th>Cliente</th>
          <th>Fornecedor</th>
          <th>Economia</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let cliente of dashboard.topClientesEconomia; let i = index">
          <td>{{ i + 1 }}</td>
          <td>{{ cliente.nomeCliente }}</td>
          <td>{{ cliente.fornecedor }}</td>
          <td>R$ {{ cliente.economiaEstimada | number:'1.2-2' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<ng-template #loadingTemplate>
  <div class="loading">Carregando dashboard...</div>
</ng-template>
```

---

### Listagem de Clientes (Atualizado)
```typescript
// components/clientes/clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDetail } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes: ClienteDetail[] = [];
  loading = true;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    // Agora usa o novo endpoint com detalhes de contrato
    this.clienteService.getClientesComDetalhes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.loading = false;
      }
    });
  }
}
```

**Template:**
```html
<!-- clientes.component.html -->
<table class="table">
  <thead>
    <tr>
      <th>Cliente</th>
      <th>CNPJ</th>
      <th>Consumo</th>
      <th>Contrato</th>
      <th>Fornecedor</th>
      <th>Economia</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let cliente of clientes">
      <td>{{ cliente.nome }}</td>
      <td>{{ cliente.cnpj }}</td>
      <td>{{ cliente.consumoMedio }} MWh</td>
      <td>{{ cliente.statusContrato }}</td>
      <td *ngIf="cliente.contratoAtivo">
        {{ cliente.contratoAtivo.fornecedor }}
      </td>
      <td *ngIf="!cliente.contratoAtivo">-</td>
      <td>
        <span *ngIf="cliente.economiaEstimada > 0" class="badge badge-success">
          R$ {{ cliente.economiaEstimada | number:'1.2-2' }}
        </span>
        <span *ngIf="cliente.economiaEstimada === 0" class="badge badge-secondary">
          Sem economia
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-info">Ver Detalhes</button>
      </td>
    </tr>
  </tbody>
</table>
```

---

### Detalhe do Cliente (Novo)
```typescript
// components/cliente-detail/cliente-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDetail, EconomiaSimulacao } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html'
})
export class ClienteDetailComponent implements OnInit {
  cliente: ClienteDetail | null = null;
  simulacao: EconomiaSimulacao | null = null;
  precoSimulacao = 400;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarCliente(id);
  }

  carregarCliente(id: number): void {
    this.clienteService.getClienteDetalhes(id).subscribe({
      next: (data) => {
        this.cliente = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading = false;
      }
    });
  }

  simularEconomia(): void {
    if (!this.cliente) return;

    this.clienteService
      .simularEconomiaComContrato(this.cliente.id, this.precoSimulacao)
      .subscribe({
        next: (data) => {
          this.simulacao = data;
        },
        error: (err) => {
          console.error('Erro na simulação:', err);
        }
      });
  }
}
```

**Template:**
```html
<!-- cliente-detail.component.html -->
<div *ngIf="cliente" class="cliente-detail">
  <h2>{{ cliente.nome }}</h2>

  <div class="info-grid">
    <div class="info-card">
      <label>CNPJ</label>
      <span>{{ cliente.cnpj }}</span>
    </div>
    <div class="info-card">
      <label>Consumo médio</label>
      <span>{{ cliente.consumoMedio }} MWh/mês</span>
    </div>
    <div class="info-card">
      <label>Região</label>
      <span>{{ cliente.regiao }}</span>
    </div>
    <div class="info-card">
      <label>Status do Contrato</label>
      <span class="badge">{{ cliente.statusContrato }}</span>
    </div>
  </div>

  <!-- Contrato Ativo ou Sem Contrato -->
  <div *ngIf="cliente.contratoAtivo" class="contrato-section">
    <h3>📜 Contrato Ativo {{ cliente.contratoAtivo.statusBadge }}</h3>
    <div class="contrato-info">
      <div>
        <label>Fornecedor</label>
        <p>{{ cliente.contratoAtivo.fornecedor }}</p>
      </div>
      <div>
        <label>Preço negociado</label>
        <p>R$ {{ cliente.contratoAtivo.precoMwh | number:'1.2-2' }}/MWh</p>
      </div>
      <div>
        <label>Período</label>
        <p>{{ cliente.contratoAtivo.dataInicio }} → {{ cliente.contratoAtivo.dataFim }}</p>
      </div>
      <div>
        <label>Economia mensal</label>
        <p class="highlight">R$ {{ cliente.economiaEstimada | number:'1.2-2' }}</p>
      </div>
    </div>
  </div>

  <div *ngIf="!cliente.contratoAtivo" class="alert alert-warning">
    ⚠️ Este cliente não possui contrato ativo no momento
  </div>

  <!-- Simulador de Economia -->
  <div class="simulacao-section" *ngIf="cliente.contratoAtivo">
    <h3>💰 Simular Economia</h3>
    <div class="form-group">
      <label>Preço do mercado (R$/MWh)</label>
      <input 
        type="number" 
        class="form-control" 
        [(ngModel)]="precoSimulacao"
        step="0.01"
        min="0"
      />
      <button class="btn btn-primary" (click)="simularEconomia()">
        Simular
      </button>
    </div>

    <div *ngIf="simulacao" class="simulacao-resultado">
      <div class="resultado-card">
        <label>Economia em valor</label>
        <p class="big">R$ {{ simulacao.economiaValor | number:'1.2-2' }}</p>
      </div>
      <div class="resultado-card">
        <label>Economia em percentual</label>
        <p class="big">{{ simulacao.economiaPercentual | number:'1.2-2' }}%</p>
      </div>
    </div>
  </div>
</div>
```

---

## 🧪 Testando as APIs

### Postman/Insomnia

```bash
# 1. Dashboard
GET http://localhost:5000/api/dashboard

# 2. Listar clientes com detalhes
GET http://localhost:5000/api/clientes/com-detalhes

# 3. Detalhe de cliente
GET http://localhost:5000/api/clientes/1/detalhes

# 4. Simular economia
POST http://localhost:5000/api/clientes/1/simular-economia?precoMercadoAtualMwh=400.00
Content-Type: application/json

{}
```

---

## 📝 Checklist: O que Mudou no Frontend

- [ ] Criar interfaces TypeScript para as novas DTOs
- [ ] Atualizar `ClienteService` com novos métodos
- [ ] Criar `DashboardService`
- [ ] Criar/atualizar componente Dashboard
- [ ] Atualizar lista de clientes para mostrar status de contrato
- [ ] Criar componente de detalhe do cliente
- [ ] Adicionar simulador de economia
- [ ] Testar integração com as novas APIs
- [ ] Ajustar estilos e cores (🟢 🔴 🟡)
- [ ] Validar responsividade

---

## 🎨 Sugestões de Styling

```css
/* Status badges */
.badge.active { background-color: #28a745; }  /* 🟢 Verde */
.badge.expired { background-color: #dc3545; } /* 🔴 Vermelho */
.badge.future { background-color: #ffc107; }  /* 🟡 Amarelo */

/* Economia highlight */
.economia-alta {
  color: #28a745;
  font-weight: bold;
  font-size: 1.2em;
}

.economia-nula {
  color: #6c757d;
  opacity: 0.7;
}

/* Cards do dashboard */
.stat-card {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-card.active { border-left: 4px solid #28a745; }
.stat-card.expired { border-left: 4px solid #dc3545; }
.stat-card.future { border-left: 4px solid #ffc107; }
.stat-card.economy { border-left: 4px solid #17a2b8; }
```
