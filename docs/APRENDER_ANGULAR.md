# 📱 Aprender Angular - Essenciais para o Projeto EnergyHub

## 🎯 Pré-requisitos: HTML, CSS e TypeScript Sólido

Antes de mergulhar no Angular, certifique-se de dominar:

- **HTML**: Estrutura semântica, formulários, tabelas
- **CSS**: Flexbox, Grid, seletores, responsividade (usado no dashboard com Tailwind CSS)
- **TypeScript**: Tipos, interfaces, classes, generics (usado em models como `Cliente`, `Dashboard`)

No EnergyHub, usamos TypeScript para definir interfaces como:

```typescript
export interface Cliente {
  id: number;
  nome: string;
  consumoMedio: number;
  regiao: string;
}
```

## 🛠️ CLI e Estrutura: Criar Projeto (ng new) e Entender Arquivos

### Angular CLI
```bash
# Criar projeto
ng new energy-hub-ui --standalone --routing

# Gerar componentes
ng generate component pages/dashboard
ng generate service services/api
```

### Estrutura de Arquivos (EnergyHub)
```
src/app/
├── app.config.ts      # Configuração global (HttpClient, rotas)
├── app.routes.ts      # Definição de rotas
├── pages/            # Páginas (dashboard, clientes)
├── services/         # Comunicação com API
└── models/           # Interfaces TypeScript
```

## 🧩 Componentes: Criar, Passar Dados (@Input, @Output)

### Componente Standalone (usado no projeto)
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...`
})
export class DashboardPage {
  // Injeção de dependências
  private apiService = inject(ApiService);
  
  // Signals para reatividade (Angular 17+)
  clientes = signal<ClienteDetail[]>([]);
  dashboard = signal<Dashboard | null>(null);
}
```

### Passagem de Dados
```typescript
// @Input: pai passa dados para filho
@Component({...})
export class ClienteCardComponent {
  @Input() cliente!: Cliente;
}

// @Output: filho emite eventos para pai
@Output() clienteSelecionado = new EventEmitter<Cliente>();

selecionar() {
  this.clienteSelecionado.emit(this.cliente);
}
```

**No EnergyHub**: O dashboard usa `@for` para listar clientes, passando dados via template.

## 🌐 Serviços e HTTP: Consumir APIs com HttpClient

### Serviço para API
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5243/api';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/clientes`);
  }

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboard`);
  }
}
```

**No EnergyHub**: `ApiService` consome endpoints REST, usado no dashboard para carregar dados.

## 🧭 Roteamento: Navegar Entre Páginas

### Configuração de Rotas
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'clientes', component: ClientesPage },
];
```

### Navegação Programática
```typescript
private router = inject(Router);

navegarParaCliente(id: number) {
  this.router.navigate(['/clientes', id]);
}
```

**No EnergyHub**: Rotas para dashboard, clientes, contratos.

## 📝 Formulários: Reativos (Reactive Forms) São Mais Poderosos

### Formulário Reativo
```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class ClienteFormComponent {
  private fb = inject(FormBuilder);

  clienteForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    consumoMedio: [0, [Validators.required, Validators.min(1)]],
    regiao: ['', Validators.required]
  });

  salvar() {
    if (this.clienteForm.valid) {
      // Enviar para API
    }
  }
}
```

**Template**:
```html
<form [formGroup]="clienteForm" (ngSubmit)="salvar()">
  <input formControlName="nome" placeholder="Nome do cliente">
  <input type="number" formControlName="consumoMedio">
  <select formControlName="regiao">
    <option value="Sudeste">Sudeste</option>
  </select>
  <button type="submit" [disabled]="!clienteForm.valid">Salvar</button>
</form>
```

**No EnergyHub**: Usado no dashboard para simulação de economia com validação.

## 1️⃣ Componentes - A Base do Angular

Um componente é uma **classe TypeScript + Template HTML + Estilos CSS**.

```typescript
// ✅ Componente moderno (Standalone)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente',           // Usado como <app-cliente></app-cliente>
  standalone: true,                  // Componente independente (Angular 14+)
  imports: [CommonModule, FormsModule], // O que este componente usa
  template: `
    <div class="container">
      <h1>{{ titulo }}</h1>
      <p>{{ mensagem }}</p>
      <button (click)="incrementar()">Clique aqui</button>
      <p>Contagem: {{ contador }}</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      background: #f0f0f0;
    }
  `]
})
export class ClienteComponent implements OnInit {
  titulo = "Painel de Clientes";
  mensagem = "Bem-vindo!";
  contador = 0;

  ngOnInit() {
    // Executado quando componente é inicializado
    console.log("ClienteComponent iniciou");
  }

  incrementar() {
    this.contador++;
  }
}
```

**Lifecycle Hooks** (funções chamadas em momentos específicos):

```typescript
export class ClienteComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Executado UMA VEZ após componente inicializar
    this.carregarDados();
  }

  ngAfterViewInit() {
    // Executado após template ser renderizado
    console.log("DOM pronto");
  }

  ngOnDestroy() {
    // Executado quando componente é destruído (sair de página)
    this.desinscreverObservables();
  }
}
```

## 2️⃣ Data Binding - Comunicação entre Class e Template

```typescript
// ✅ String Interpolation {{ }}
<p>Olá, {{ nome }}</p>  <!-- Exibe: "Olá, João" -->
<p>2 + 2 = {{ 2 + 2 }}</p>  <!-- Exibe: "2 + 2 = 4" -->

// ✅ Property Binding [propriedade]
<img [src]="urlImagem" />
<button [disabled]="estaCarregando">Salvar</button>
<div [ngClass]="{ 'ativo': isAtivo, 'inativo': !isAtivo }"></div>

// ✅ Event Binding (evento)=handler
<button (click)="salvar()">Salvar</button>
<input (keyup)="pesquisar($event)" placeholder="Digite..."/>
<form (submit)="enviarFormulario()">...</form>

// ✅ Two-Way Binding [(ngModel)]
export class FormComponent {
  nome = "João";
  email = "";
}

<input [(ngModel)]="nome" />  <!-- Qualquer alteração atualiza a variável -->
<input [(ngModel)]="email" />
<p>Nome: {{ nome }}, Email: {{ email }}</p>
```

## 3️⃣ Services e Injeção de Dependência

Services compartilham dados entre componentes:

```typescript
// ✅ Criar um Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Disponível em toda aplicação
})
export class ClienteService {
  private apiUrl = 'http://localhost:5000/api/clientes';

  constructor(private http: HttpClient) {}

  // Buscar todos
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Buscar um
  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Criar
  createCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  // Atualizar
  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  // Deletar
  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

// ✅ Usar o Service em um Componente
import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  template: `
    <div>
      <h1>Clientes</h1>
      <button (click)="carregarClientes()">Carregar</button>
      <ul>
        <li *ngFor="let cliente of clientes">
          {{ cliente.nome }} - {{ cliente.regiao }}
        </li>
      </ul>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  carregando = false;

  // Injeção do Service via constructor
  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.carregando = true;
    
    // Subscribe = "ouça quando dados chegarem"
    this.clienteService.getClientes().subscribe(
      (dados) => {
        this.clientes = dados;
        this.carregando = false;
        console.log("Clientes carregados:", dados);
      },
      (erro) => {
        console.error("Erro:", erro);
        this.carregando = false;
      }
    );
  }
}
```

## 4️⃣ Observables e RxJS

Observables = fluxo de dados assíncrono (chegam os dados quando estiverem prontos)

```typescript
import { Observable } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

// ✅ Observable básico
const dados$ = this.http.get('/api/clientes');  // $ = convenção para Observable

// ✅ Subscribe (ouvir dados)
dados$.subscribe(
  (valor) => console.log("Sucesso:", valor),
  (erro) => console.error("Erro:", erro),
  () => console.log("Completado") // Opcional
);

// ✅ Operadores (transformar dados)
this.clienteService.getClientes()
  .pipe(
    map(clientes => clientes.filter(c => c.regiao === 'Sudeste')), // Filtrar
    map(clientes => clientes.map(c => c.nome)) // Extrair nomes
  )
  .subscribe(
    (nomes) => console.log(nomes) // ["Empresa A", "Empresa B"]
  );

// ✅ Exemplo real: Buscar cliente por ID
searchClienteById(id: number) {
  return this.clienteService.getClienteById(id)
    .pipe(
      // Se cliente null, retornar vazio
      map(cliente => cliente || {}),
      // Capturar erro e retornar null
      catchError(erro => {
        console.error("Erro:", erro);
        return of(null);
      })
    );
}
```

## 5️⃣ Diretivas - Lógica no Template

```typescript
// ✅ *ngIf - Mostrar/ocultar
<div *ngIf="isLogado; else loginButton">
  <p>Bem-vindo, {{ usuario.nome }}</p>
</div>
<ng-template #loginButton>
  <button (click)="login()">Fazer login</button>
</ng-template>

// ✅ *ngFor - Repetir elementos
<ul>
  <li *ngFor="let item of items; let i = index">
    {{ i + 1 }}. {{ item.nome }}
  </li>
</ul>

// ✅ [ngClass] - Classes condicionais
<div [ngClass]="{ 'active': isActive, 'error': hasError }">
  Status
</div>

// ✅ [ngStyle] - Estilos dinâmicos
<p [ngStyle]="{ 'color': isError ? 'red' : 'green' }">
  Mensagem
</p>

// ✅ *ngSwitch - Case/Switch
<div [ngSwitch]="status">
  <p *ngSwitchCase="'carregando'">Carregando...</p>
  <p *ngSwitchCase="'sucesso'">Pronto!</p>
  <p *ngSwitchDefault>Desconhecido</p>
</div>
```

## 6️⃣ Forms em Angular

```typescript
// ✅ Template-driven form
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-form',
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="enviar()">
      <input [(ngModel)]="form.nome" name="nome" required />
      <input [(ngModel)]="form.email" name="email" type="email" required />
      <input [(ngModel)]="form.consumo" name="consumo" type="number" />
      <button type="submit" [disabled]="!form.nome || !form.email">
        Salvar
      </button>
    </form>
  `
})
export class ClienteFormComponent {
  form = {
    nome: '',
    email: '',
    consumo: 0
  };

  enviar() {
    console.log("Enviando:", this.form);
    // Chamar service aqui
  }
}

// ✅ Reactive form (mais poderoso)
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-reactive',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="enviar()">
      <input formControlName="nome" placeholder="Nome" />
      <span *ngIf="form.get('nome')?.hasError('required')">
        Nome é obrigatório
      </span>

      <input formControlName="email" type="email" placeholder="Email" />
      <span *ngIf="form.get('email')?.hasError('email')">
        Email inválido
      </span>

      <button type="submit" [disabled]="form.invalid">
        Salvar
      </button>
    </form>
  `
})
export class ClienteReactiveComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      consumo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  enviar() {
    if (this.form.valid) {
      console.log(this.form.value);
      // { nome: 'João', email: 'joao@email.com', consumo: 150 }
    }
  }
}
```

## 7️⃣ Roteamento - Navegar entre Páginas

```typescript
// ✅ app.routes.ts - Definir rotas
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/novo', component: ClienteFormComponent },
  { path: 'clientes/:id', component: ClienteFormComponent },
  { path: '**', redirectTo: '' }  // Fallback
];

// ✅ main.ts - Bootstrap com Router
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});

// ✅ Usar rotas no template
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/clientes">Clientes</a>
  <a routerLink="/clientes/novo">Novo Cliente</a>
</nav>

<router-outlet></router-outlet>  <!-- Componente da rota aparece aqui -->

// ✅ Navegar programaticamente
import { Router } from '@angular/router';

export class ClientesComponent {
  constructor(private router: Router) {}

  editarCliente(id: number) {
    this.router.navigate(['/clientes', id]);
  }
}

// ✅ Pegar parâmetros da rota
import { ActivatedRoute } from '@angular/router';

export class ClienteFormComponent implements OnInit {
  id: number | null = null;

  constructor(private route: ActivatedRoute, private service: ClienteService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.carregarCliente(this.id);
      }
    });
  }

  carregarCliente(id: number) {
    this.service.getClienteById(id).subscribe(data => {
      console.log("Cliente:", data);
    });
  }
}
```

## 8️⃣ Pipes - Formatação de Dados

```typescript
// ✅ Pipes built-in
<p>{{ data | date:'dd/MM/yyyy' }}</p>  <!-- 14/04/2026 -->
<p>{{ valor | currency:'BRL' }}</p>    <!-- R$ 1.234,56 -->
<p>{{ texto | uppercase }}</p>         <!-- TEXTO -->
<p>{{ texto | lowercase }}</p>         <!-- texto -->
<p>{{ 123.456 | number:'1.2-2' }}</p>  <!-- 123.46 -->

// ✅ Criar pipe customizado
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consumoMwh',
  standalone: true
})
export class ConsumoMwhPipe implements PipeTransform {
  transform(valor: number): string {
    return `${valor.toFixed(2)} MWh`;
  }
}

// Usar
<p>{{ 150.5 | consumoMwh }}</p>  <!-- 150.50 MWh -->
```

## 9️⃣ Comunicação entre Componentes

```typescript
// ✅ Parent → Child via @Input
// parent.component.ts
@Component({
  template: `
    <app-cliente [cliente]="clienteSelecionado"></app-cliente>
  `
})
export class ParentComponent {
  clienteSelecionado = { id: 1, nome: 'Empresa A' };
}

// cliente.component.ts
import { Input } from '@angular/core';

@Component({
  selector: 'app-cliente',
  template: `<h2>{{ cliente.nome }}</h2>`
})
export class ClienteComponent {
  @Input() cliente: any;
}

// ✅ Child → Parent via @Output
// filho.component.ts
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button (click)="clicado()">Clique</button>`
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<string>();

  clicado() {
    this.onClick.emit('Botão foi clicado!');
  }
}

// pai.component.ts
@Component({
  template: `
    <app-button (onClick)="receberMensagem($event)"></app-button>
    <p>{{ mensagem }}</p>
  `
})
export class PaiComponent {
  mensagem = '';

  receberMensagem(msg: string) {
    this.mensagem = msg;
  }
}

// ✅ Via Service (compartilhar estado)
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private clienteSelecionadoSource = new BehaviorSubject<any>(null);
  clienteSelecionado$ = this.clienteSelecionadoSource.asObservable();

  selecionarCliente(cliente: any) {
    this.clienteSelecionadoSource.next(cliente);
  }
}

// Componente A
@Component({...})
export class ListaComponent {
  constructor(private estado: EstadoService) {}

  selecionar(cliente: any) {
    this.estado.selecionarCliente(cliente);
  }
}

// Componente B
@Component({...})
export class DetalhesComponent {
  cliente$ = this.estado.clienteSelecionado$;

  constructor(private estado: EstadoService) {}
}
```

## 🔟 HTTP Requests

```typescript
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
});

// service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ✅ GET
  getClientes() {
    return this.http.get('http://localhost:5000/api/clientes');
  }

  // ✅ POST
  createCliente(cliente: any) {
    return this.http.post('http://localhost:5000/api/clientes', cliente);
  }

  // ✅ PUT
  updateCliente(id: number, cliente: any) {
    return this.http.put(`http://localhost:5000/api/clientes/${id}`, cliente);
  }

  // ✅ DELETE
  deleteCliente(id: number) {
    return this.http.delete(`http://localhost:5000/api/clientes/${id}`);
  }
}

// component.ts
export class ClientesComponent {
  clientes$ = this.api.getClientes();

  constructor(private api: ApiService) {}
}
```

## 📌 Estrutura Típica do Frontend

```
src/
├── app/
│   ├── pages/
│   │   ├── home/
│   │   ├── clientes/
│   │   ├── cliente-form/
│   │   └── contratos/
│   ├── components/
│   │   ├── nav/
│   │   └── footer/
│   ├── services/
│   │   ├── api.service.ts
│   │   ├── cliente.service.ts
│   │   └── contrato.service.ts
│   ├── models/
│   │   ├── cliente.model.ts
│   │   └── contrato.model.ts
│   ├── app.routes.ts
│   ├── app.component.ts
│   └── app.config.ts
├── main.ts
└── styles.css
```

Angular é poderoso! Foque em:
- ✅ Components e Templates
- ✅ Services e Injeção de Dependência
- ✅ Observables e RxJS
- ✅ Routing
- ✅ HTTP Requests
