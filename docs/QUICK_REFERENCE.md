# ⚡ Quick Reference - Copy & Paste

Snippets prontos para usar no projeto EnergyHub.

## 🔷 C# / .NET Snippets

### Controller Padrão
```csharp
using Microsoft.AspNetCore.Mvc;
using YourNamespace.Services;
using YourNamespace.DTOs;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClienteService _service;

        public ClientesController(IClienteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ClienteDto>>> GetAll()
        {
            var clientes = await _service.GetAllAsync();
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClienteDto>> GetById(int id)
        {
            var cliente = await _service.GetByIdAsync(id);
            if (cliente == null)
                return NotFound();
            return Ok(cliente);
        }

        [HttpPost]
        public async Task<ActionResult<ClienteDto>> Create(CreateClienteDto dto)
        {
            var cliente = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, cliente);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateClienteDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
```

### Service Padrão
```csharp
using YourNamespace.Repositories;
using YourNamespace.DTOs;
using AutoMapper;

namespace YourNamespace.Services
{
    public interface IClienteService
    {
        Task<List<ClienteDto>> GetAllAsync();
        Task<ClienteDto> GetByIdAsync(int id);
        Task<ClienteDto> CreateAsync(CreateClienteDto dto);
        Task UpdateAsync(int id, UpdateClienteDto dto);
        Task DeleteAsync(int id);
    }

    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _repository;
        private readonly IMapper _mapper;

        public ClienteService(IClienteRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ClienteDto>> GetAllAsync()
        {
            var clientes = await _repository.GetAllAsync();
            return _mapper.Map<List<ClienteDto>>(clientes);
        }

        public async Task<ClienteDto> GetByIdAsync(int id)
        {
            var cliente = await _repository.GetByIdAsync(id);
            return _mapper.Map<ClienteDto>(cliente);
        }

        public async Task<ClienteDto> CreateAsync(CreateClienteDto dto)
        {
            if (dto.ConsumoMedio <= 0)
                throw new InvalidOperationException("Consumo deve ser maior que 0");

            var cliente = _mapper.Map<Cliente>(dto);
            await _repository.AddAsync(cliente);
            return _mapper.Map<ClienteDto>(cliente);
        }

        public async Task UpdateAsync(int id, UpdateClienteDto dto)
        {
            var cliente = await _repository.GetByIdAsync(id);
            if (cliente == null)
                throw new KeyNotFoundException("Cliente não encontrado");

            _mapper.Map(dto, cliente);
            await _repository.UpdateAsync(cliente);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
```

### Repository Padrão
```csharp
using YourNamespace.Data;
using Microsoft.EntityFrameworkCore;

namespace YourNamespace.Repositories
{
    public interface IClienteRepository
    {
        Task<List<Cliente>> GetAllAsync();
        Task<Cliente> GetByIdAsync(int id);
        Task AddAsync(Cliente cliente);
        Task UpdateAsync(Cliente cliente);
        Task DeleteAsync(int id);
    }

    public class ClienteRepository : IClienteRepository
    {
        private readonly ApplicationDbContext _context;

        public ClienteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cliente>> GetAllAsync()
        {
            return await _context.Clientes.ToListAsync();
        }

        public async Task<Cliente> GetByIdAsync(int id)
        {
            return await _context.Clientes.FindAsync(id);
        }

        public async Task AddAsync(Cliente cliente)
        {
            await _context.Clientes.AddAsync(cliente);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Cliente cliente)
        {
            _context.Clientes.Update(cliente);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
            }
        }
    }
}
```

### Program.cs (DI Setup)
```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Adicionar DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    ));

// Registrar Services
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();

// AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (permitir requisições do Angular)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAngular");
app.MapControllers();
app.Run();
```

### DTOs
```csharp
namespace YourNamespace.DTOs
{
    public class ClienteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Cnpj { get; set; }
        public decimal ConsumoMedio { get; set; }
        public string Regiao { get; set; }
    }

    public class CreateClienteDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, MinimumLength = 3)]
        public string Nome { get; set; }

        [Required]
        [RegularExpression(@"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}")]
        public string Cnpj { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal ConsumoMedio { get; set; }

        [Required]
        public string Regiao { get; set; }
    }

    public class UpdateClienteDto
    {
        public string Nome { get; set; }
        public decimal ConsumoMedio { get; set; }
        public string Regiao { get; set; }
    }
}
```

## 📱 Angular Snippets

### Service Padrão
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  consumoMedio: number;
  regiao: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = 'http://localhost:5000/api/clientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  create(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  update(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

### Componente com Service
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from './cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Clientes</h1>
      
      <div *ngIf="carregando" class="loading">
        <span class="spinner"></span>
        Carregando...
      </div>

      <table *ngIf="!carregando">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Consumo (MWh)</th>
            <th>Região</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cliente of clientes">
            <td>{{ cliente.nome }}</td>
            <td>{{ cliente.cnpj }}</td>
            <td>{{ cliente.consumoMedio | number:'1.2-2' }}</td>
            <td>{{ cliente.regiao }}</td>
            <td>
              <button (click)="editar(cliente.id)">Editar</button>
              <button (click)="deletar(cliente.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
  `]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  carregando = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.carregando = true;
    this.clienteService.getAll().subscribe({
      next: (dados) => {
        this.clientes = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar:', erro);
        this.carregando = false;
      }
    });
  }

  editar(id: number) {
    console.log('Editar cliente:', id);
  }

  deletar(id: number) {
    if (confirm('Tem certeza?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.clientes = this.clientes.filter(c => c.id !== id);
        },
        error: (erro) => console.error('Erro ao deletar:', erro)
      });
    }
  }
}
```

### Form com Validação
```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="enviar()">
      <div class="form-group">
        <label>Nome *</label>
        <input formControlName="nome" placeholder="Nome completo"/>
        <span class="error" *ngIf="form.get('nome')?.hasError('required')">
          Nome é obrigatório
        </span>
      </div>

      <div class="form-group">
        <label>CNPJ *</label>
        <input formControlName="cnpj" placeholder="00.000.000/0000-00"/>
        <span class="error" *ngIf="form.get('cnpj')?.hasError('required')">
          CNPJ é obrigatório
        </span>
      </div>

      <div class="form-group">
        <label>Consumo Médio (MWh) *</label>
        <input formControlName="consumoMedio" type="number" placeholder="0.00"/>
        <span class="error" *ngIf="form.get('consumoMedio')?.hasError('required')">
          Consumo é obrigatório
        </span>
      </div>

      <div class="form-group">
        <label>Região *</label>
        <select formControlName="regiao">
          <option value="">Selecione...</option>
          <option value="Sudeste">Sudeste</option>
          <option value="Sul">Sul</option>
          <option value="Nordeste">Nordeste</option>
          <option value="Norte">Norte</option>
          <option value="Centro-Oeste">Centro-Oeste</option>
        </select>
      </div>

      <button type="submit" [disabled]="form.invalid">
        {{ modo === 'novo' ? 'Criar' : 'Atualizar' }}
      </button>
    </form>
  `,
  styles: [`
    form { max-width: 400px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, select { width: 100%; padding: 8px; border: 1px solid #ddd; }
    .error { color: red; font-size: 0.9em; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; }
  `]
})
export class ClienteFormComponent {
  form: FormGroup;
  modo: 'novo' | 'editar' = 'novo';

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required]],
      consumoMedio: [0, [Validators.required, Validators.min(0)]],
      regiao: ['', Validators.required]
    });
  }

  enviar() {
    if (this.form.valid) {
      const dados = this.form.value;

      if (this.modo === 'novo') {
        this.clienteService.create(dados).subscribe({
          next: () => {
            alert('Cliente criado com sucesso!');
            this.form.reset();
          },
          error: (err) => alert('Erro: ' + err.message)
        });
      } else {
        // Atualizar
      }
    }
  }
}
```

## 🗄️ MySQL Queries Úteis

```sql
-- Ver clientes
SELECT * FROM Clientes;

-- Ver contratos com cliente
SELECT c.Id, c.Nome, ct.Fornecedor, ct.PrecoMwh, ct.DataInicio
FROM Clientes c
LEFT JOIN Contratos ct ON c.Id = ct.ClienteId;

-- Consumo total por região
SELECT Regiao, SUM(ConsumoMedio) as TotalConsumo
FROM Clientes
GROUP BY Regiao
ORDER BY TotalConsumo DESC;

-- Contratos expirados
SELECT * FROM Contratos
WHERE DataFim < NOW();

-- Atualizar consumo
UPDATE Clientes SET ConsumoMedio = 250 WHERE Id = 1;

-- Deletar cliente
DELETE FROM Clientes WHERE Id = 1;
```

## 📦 Git Commands

```bash
# Clonar projeto
git clone https://github.com/seu-repo/energy-hub.git

# Criar branch
git checkout -b feature/nova-funcionalidade

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: adicionar nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade

# Atualizar local
git pull origin main

# Ver status
git status
```

## 🚀 Built & Run Commands

```bash
# Backend
cd backend/EnergyHub.API
dotnet restore
dotnet build
dotnet run

# Frontend
cd frontend/energy-hub-ui
npm install
npm start

# Build para produção
npm run build
```

## ⚙️ Variáveis de Ambiente

### appsettings.json (Backend)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=energy_hub;User=root;Password=sua_senha;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### environment.ts (Frontend)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

---

**Dica**: Use estes snippets como base e adapte para suas necessidades!
