# 🧱 Interfaces e Repositories: O Fluxo Completo Explicado

## 📋 Índice
- [O que é uma Interface?](#o-que-é-uma-interface)
- [O que é um Repository?](#o-que-é-um-repository)
- [Por que usar Interface + Repository?](#por-que-usar-interface--repository)
- [Fluxo Completo Passo a Passo](#fluxo-completo-passo-a-passo)
- [Exemplo Real do Energy Hub](#exemplo-real-do-energy-hub)
- [Injeção de Dependência: A Mágica Acontece](#injeção-de-dependência-a-mágica-acontece)
- [Resumo Prático](#resumo-prático)

---

## 🎯 O que é uma Interface?

Uma **interface** é como um **contrato** ou uma **promessa**. Ela diz "alguém sabe fazer isso", mas não diz **como** faz.

```csharp
// Interface: O CONTRATO
public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();
    Task<Cliente?> GetByIdAsync(int id);
    Task<Cliente> CreateAsync(CreateClienteDto dto, int userId);
    Task<bool> DeleteAsync(int id);
}
```

**O que essa interface promete:**
- ✅ "Alguém sabe buscar todos os clientes"
- ✅ "Alguém sabe buscar um cliente por ID"
- ✅ "Alguém sabe criar um cliente"
- ✅ "Alguém sabe deletar um cliente"

**O que ela NÃO diz:**
- ❌ "Como buscar os clientes"
- ❌ "Se vai usar SQL, MongoDB, ou arquivo texto"
- ❌ "Qual banco de dados vai usar"

---

## ⚙️ O que é um Repository?

Um **repository** é a **implementação real** do contrato. Ele sabe **COMO** fazer as coisas.

```csharp
// Repository: A IMPLEMENTAÇÃO REAL
public class ClienteRepository : IClienteRepository
{
    private readonly ApplicationDbContext _context;

    public ClienteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cliente>> GetAllAsync()
    {
        // AQUI ELE REALMENTE BUSCA NO BANCO!
        return await _context.Clientes
            .Include(c => c.Contratos)
            .Include(c => c.Consumos)
            .ToListAsync();
    }

    public async Task<Cliente> CreateAsync(CreateClienteDto dto, int userId)
    {
        // AQUI ELE REALMENTE SALVA NO BANCO!
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            // ...
            UsuarioId = userId
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return cliente;
    }
}
```

---

## 🤔 Por que usar Interface + Repository?

### 1️⃣ **Desacoplamento** 
O Service não sabe qual banco está usando:
```csharp
// Service não sabe se é SQL Server, PostgreSQL, etc!
public class ClienteService
{
    private readonly IClienteRepository _repository; // Interface!

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }
}
```

### 2️⃣ **Testabilidade**
Podemos criar um repository falso para testes:
```csharp
// Repository falso para testes
public class FakeClienteRepository : IClienteRepository
{
    public async Task<List<Cliente>> GetAllAsync()
    {
        return new List<Cliente>
        {
            new Cliente { Id = 1, Nome = "Cliente Teste" }
        };
    }
    // ...
}
```

### 3️⃣ **Flexibilidade**
Podemos trocar o repository sem mudar o Service:
- Hoje: SQL Server
- Amanhã: PostgreSQL  
- Depois: MongoDB

---

## 🔄 Fluxo Completo Passo a Passo

### **1. Cliente faz requisição**
```json
POST /api/clientes
{
  "nome": "Empresa ABC",
  "cnpj": "12.345.678/0001-90",
  "consumoMedio": 1000,
  "regiao": "Sudeste"
}
```

### **2. Controller recebe**
```csharp
[HttpPost]
public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
{
    var userId = GetUserId();
    var cliente = await _clienteService.CreateAsync(dto, userId);
    return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
}
```

### **3. Service processa**
```csharp
public class ClienteService
{
    private readonly IClienteRepository _repository;

    public async Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId)
    {
        // Service chama a INTERFACE (não sabe como funciona!)
        var cliente = await _repository.CreateAsync(dto, userId);
        return MapToDto(cliente);
    }
}
```

### **4. Interface é o contrato**
```csharp
public interface IClienteRepository
{
    Task<Cliente> CreateAsync(CreateClienteDto dto, int userId);
}
```

### **5. Repository executa**
```csharp
public class ClienteRepository : IClienteRepository
{
    public async Task<Cliente> CreateAsync(CreateClienteDto dto, int userId)
    {
        // Repository REALMENTE salva no banco!
        var cliente = new Cliente { /* ... */ };
        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        return cliente;
    }
}
```

---

## 🏭 Exemplo Real do Energy Hub

### **Interface (Contrato)**
```csharp
// IClienteRepository.cs
public interface IClienteRepository
{
    Task<List<Cliente>> GetAllAsync();
    Task<List<Cliente>> GetAllAsync(int userId);
    Task<Cliente?> GetByIdAsync(int id);
    Task<Cliente?> GetByIdAsync(int id, int userId);
    Task<bool> ExistsAsync(int id);
    Task<bool> ExistsAsync(int id, int userId);
    Task<Cliente> CreateAsync(CreateClienteDto dto, int userId);
    Task<Cliente?> UpdateAsync(int id, UpdateClienteDto dto, int userId);
    Task<bool> DeleteAsync(int id);
    Task<bool> DeleteAsync(int id, int userId);
}
```

### **Repository (Implementação)**
```csharp
// ClienteRepository.cs
public class ClienteRepository : IClienteRepository
{
    private readonly ApplicationDbContext _context;

    public ClienteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cliente>> GetAllAsync(int userId)
    {
        // IMPLEMENTAÇÃO REAL: busca no SQL Server
        return await _context.Clientes
            .Where(c => c.UsuarioId == userId)
            .Include(c => c.Contratos)
            .Include(c => c.Consumos)
            .ToListAsync();
    }

    public async Task<Cliente> CreateAsync(CreateClienteDto dto, int userId)
    {
        // IMPLEMENTAÇÃO REAL: cria no SQL Server
        var cliente = new Cliente
        {
            Nome = dto.Nome,
            Cnpj = dto.Cnpj,
            ConsumoMedio = dto.ConsumoMedio,
            Regiao = dto.Regiao,
            UsuarioId = userId
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return cliente;
    }
}
```

### **Service (Usa a Interface)**
```csharp
// ClienteService.cs
public class ClienteService
{
    private readonly IClienteRepository _repository;

    public ClienteService(IClienteRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ClienteDto>> GetAllAsync(int userId)
    {
        // Service não sabe que é SQL Server!
        var clientes = await _repository.GetAllAsync(userId);
        return clientes.Select(MapToDto).ToList();
    }
}
```

---

## 🪄 Injeção de Dependência: A Mágica Acontece

### **Program.cs (Onde tudo se conecta)**
```csharp
// 1. Registra a interface e sua implementação
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();

// 2. Registra o service
builder.Services.AddScoped<ClienteService>();

// 3. Registra o controller
builder.Services.AddControllers();
```

### **O que o .NET faz automaticamente:**
1. **Controller precisa de `ClienteService`** → .NET cria `ClienteService`
2. **Service precisa de `IClienteRepository`** → .NET cria `ClienteRepository`
3. **Repository precisa de `ApplicationDbContext`** → .NET cria o contexto do banco

**Resultado:** Tudo funciona sem `new` manualmente!

---

## 🎯 Resumo Prático

| **Camada** | **Responsabilidade** | **Exemplo** |
|------------|---------------------|-------------|
| **Interface** | Definir o contrato (O QUÊ) | `IClienteRepository` |
| **Repository** | Implementar o contrato (COMO) | `ClienteRepository` |
| **Service** | Usar o contrato (NÃO SABE COMO) | `ClienteService` |
| **Controller** | Chamar o Service | `ClientesController` |

### **Regra de Ouro:**
- **Service** só conhece a **Interface**
- **Repository** implementa a **Interface**
- **Controller** só conhece o **Service**
- **Ninguém** sabe qual banco está sendo usado!

### **Benefícios:**
✅ **Testes fáceis** - Mock das interfaces  
✅ **Troca de banco** - Sem mudar o código  
✅ **Código limpo** - Cada um faz sua parte  
✅ **Manutenibilidade** - Mudanças isoladas  

---

## 🚀 Dicas Práticas

### **1. Sempre use interfaces para repositories**
```csharp
// ✅ Bom
public interface IClienteRepository { }
public class ClienteRepository : IClienteRepository { }

// ❌ Ruim
public class ClienteRepository { } // Sem interface!
```

### **2. Methods devem ser async se usam banco**
```csharp
// ✅ Bom
Task<List<Cliente>> GetAllAsync();

// ❌ Ruim
List<Cliente> GetAll(); // Bloqueia a thread!
```

### **3. Nome padrão: I + Nome + Repository**
```csharp
// ✅ Padrão
IClienteRepository, IContratoRepository, IConsumoRepository

// ❌ Não segue padrão
RepoCliente, RepositoryDeClientes
```

### **4. Uma interface por entidade**
```csharp
// ✅ Bom
public interface IClienteRepository { }
public interface IContratoRepository { }

// ❌ Ruim
public interface IRepository { } // Genérico demais!
```

---

## 🎉 Conclusão

A **Interface** é a **promessa** e o **Repository** é a **realização**. 

Juntos eles criam um sistema flexível, testável e manutenível onde cada camada faz exatamente o que deve fazer, sem saber como as outras funcionam internamente.

**No seu Energy Hub:**  
- `IClienteRepository` promete "sei gerenciar clientes"  
- `ClienteRepository` realmente "gerencia clientes no SQL Server"  
- `ClienteService` usa a promessa sem saber como é feito  
- `ClientesController` chama o service sem saber do banco  

**É isso! 🎯**
