# 🏗️ Entender a Arquitetura do EnergyHub

## O que é Arquitetura em Camadas?

A arquitetura do EnergyHub segue o padrão **em camadas** (Layered Architecture), que é o padrão mais usado em aplicações empresariais. A ideia é simples: **dividir responsabilidades em camadas**.

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT (Angular)  - Interface com usuário              │
├─────────────────────────────────────────────────────────┤
│  API REST (.NET)   - Recebe requisições HTTP            │
├─────────────────────────────────────────────────────────┤
│  CONTROLLERS       - Processa requisições               │
│  SERVICES          - Lógica de negócio                  │
│  REPOSITORIES      - Acesso aos dados                   │
├─────────────────────────────────────────────────────────┤
│  DATABASE (MySQL)  - Armazena dados                     │
└─────────────────────────────────────────────────────────┘
```

## As 3 Camadas Principais

### 1️⃣ CONTROLLER (Camada de Apresentação)
**Responsabilidade**: Receber requisições HTTP e retornar respostas

```csharp
[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly IClienteService _service;

    public ClientesController(IClienteService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await _service.GetClienteByIdAsync(id);
        if (cliente == null)
            return NotFound(); // HTTP 404
        return Ok(cliente); // HTTP 200
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
    {
        var cliente = await _service.CreateClienteAsync(dto);
        return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente); // HTTP 201
    }
}
```

**O Controller NÃO faz**:
- ❌ Lógica de negócio complexa
- ❌ Acesso direto ao banco de dados
- ❌ Validações sofisticadas

### 2️⃣ SERVICE (Camada de Lógica de Negócio)
**Responsabilidade**: Implementar toda a lógica do negócio

```csharp
public interface IClienteService
{
    Task<ClienteDto> GetClienteByIdAsync(int id);
    Task<ClienteDto> CreateClienteAsync(CreateClienteDto dto);
}

public class ClienteService : IClienteService
{
    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    public async Task<ClienteDto> GetClienteByIdAsync(int id)
    {
        var cliente = await _repository.GetByIdAsync(id);
        
        if (cliente == null)
            return null;

        // Aqui você faz transformações, cálculos, etc
        return new ClienteDto
        {
            Id = cliente.Id,
            Nome = cliente.Nome,
            ConsumoMedio = cliente.ConsumoMedio
        };
    }

    public async Task<ClienteDto> CreateClienteAsync(CreateClienteDto dto)
    {
        // Validação de negócio
        if (dto.ConsumoMedio <= 0)
            throw new InvalidOperationException("Consumo deve ser maior que 0");

        // Criar entidade
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            ConsumoMedio = dto.ConsumoMedio,
            Regiao = dto.Regiao
        };

        // Salvar e retornar
        await _repository.AddAsync(cliente);
        return new ClienteDto { Id = cliente.Id, Nome = cliente.Nome };
    }
}
```

### 3️⃣ REPOSITORY (Camada de Acesso a Dados)
**Responsabilidade**: Comunicar com o banco de dados

```csharp
public interface IClienteRepository
{
    Task<Cliente> GetByIdAsync(int id);
    Task<List<Cliente>> GetAllAsync();
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

    public async Task<Cliente> GetByIdAsync(int id)
    {
        return await _context.Clientes
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<Cliente>> GetAllAsync()
    {
        return await _context.Clientes.ToListAsync();
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
        var cliente = await GetByIdAsync(id);
        if (cliente != null)
        {
            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
        }
    }
}
```

## 🔄 Fluxo Completo: Criar um Cliente

Vamos rastrear o que acontece quando você clica em "Criar Cliente" no Angular:

### Passo 1: Cliente Clica no Botão (Angular)
```typescript
// cliente-form.component.ts
onClick() {
  this.apiService.createCliente(this.form).subscribe(
    (result) => console.log('Sucesso!', result)
  );
}
```

### Passo 2: HTTP POST é Enviado
```
POST /api/clientes
Content-Type: application/json

{
  "nome": "Empresa XYZ",
  "cnpj": "12.345.678/0001-90",
  "consumoMedio": 150.5,
  "regiao": "Sudeste"
}
```

### Passo 3: Controller Recebe
```csharp
[HttpPost]
public async Task<ActionResult> CreateCliente(CreateClienteDto dto)
{
    // ✅ Controller só recebe e passa adiante
    var resultado = await _service.CreateClienteAsync(dto);
    return CreatedAtAction(nameof(GetCliente), new { id = resultado.Id }, resultado);
}
```

### Passo 4: Service Valida e Processa
```csharp
public async Task<ClienteDto> CreateClienteAsync(CreateClienteDto dto)
{
    // ✅ Service valida regras de negócio
    if (dto.ConsumoMedio <= 0)
        throw new InvalidOperationException("Inválido");

    // ✅ Service cria a entidade
    var cliente = new Cliente { ... };
    
    // ✅ Service passa para Repository
    await _repository.AddAsync(cliente);
    
    return new ClienteDto { ... };
}
```

### Passo 5: Repository Salva no BD
```csharp
public async Task AddAsync(Cliente cliente)
{
    // ✅ Repository acessa o BD via Entity Framework
    await _context.Clientes.AddAsync(cliente);
    await _context.SaveChangesAsync();
    
    // SQL gerado:
    // INSERT INTO Clientes (Nome, Cnpj, ConsumoMedio, Regiao) 
    // VALUES ('Empresa XYZ', '12.345.678/0001-90', 150.5, 'Sudeste')
}
```

### Passo 6: Resposta Volta ao Cliente
```json
201 Created
{
  "id": 1,
  "nome": "Empresa XYZ",
  "status": "Sucesso"
}
```

## 💡 Por Que Dividir em Camadas?

| Problema | Solução | Benefício |
|----------|---------|-----------|
| Código misturado | Separar responsabilidades | Fácil de entender |
| Difícil testar | Cada camada testável isoladamente | Confiança no código |
| Mudanças quebram tudo | Mudanças isoladas por camada | Manutenção segura |
| Reutilizar código | Service reutilizável | Evita duplicação |

## 📊 Entidades do EnergyHub

### Cliente
```csharp
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; }          // "Empresa XYZ"
    public string Cnpj { get; set; }          // "12.345.678/0001-90"
    public decimal ConsumoMedio { get; set; } // 150.5 MWh
    public string Regiao { get; set; }        // "Sudeste"
    
    public List<Contrato> Contratos { get; set; } // Relacionamento 1:N
}
```

### Contrato
```csharp
public class Contrato
{
    public int Id { get; set; }
    public int ClienteId { get; set; }       // FK
    public string Fornecedor { get; set; }   // "Distribuidora ABC"
    public decimal PrecoMwh { get; set; }    // Preço por MWh
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    
    public Cliente Cliente { get; set; } // Relacionamento
}
```

## 🎯 Padrão Importante: Dependency Injection (DI)

```csharp
// Program.cs - Configuração
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();

// Controller - Recebe automaticamente
[ApiController]
public class ClientesController
{
    private readonly IClienteService _service;

    // Constructor Injection - .NET "injeta" automaticamente
    public ClientesController(IClienteService service)
    {
        _service = service;
    }
}
```

**Benefício**: Services são desacoplados e fáceis de testar com mocks!

## 📌 DTOs (Data Transfer Objects)

```csharp
// Cliente do BD (contém tudo)
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Cnpj { get; set; }
    public DateTime CriadoEm { get; set; }
    public string SenhaHash { get; set; } // ⚠️ Sensível!
}

// DTO para API (apenas o necessário)
public class ClienteDto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Cnpj { get; set; }
    // ✅ Sem dados sensíveis!
}

// DTO para Criação
public class CreateClienteDto
{
    public string Nome { get; set; }
    public string Cnpj { get; set; }
    public decimal ConsumoMedio { get; set; }
    public string Regiao { get; set; }
    // ✅ Apenas campos necessários
}
```

## ✅ Resumo da Arquitetura

A arquitetura em 3 camadas garante:
- **Separação de responsabilidades** - cada camada tem um trabalho
- **Testabilidade** - fácil criar testes unitários
- **Manutenibilidade** - mudanças isoladas
- **Reutilização** - services usados em múltiplos controllers
- **Escalabilidade** - adicionar features sem quebrar código existente
