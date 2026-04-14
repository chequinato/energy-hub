# 🔷 Aprender C# - Essenciais para o Projeto

## 1️⃣ Tipos de Dados em C#

```csharp
// ✅ Tipos de Valor (valor armazenado diretamente)
int idade = 25;                    // Inteiro (32-bit)
long clientesAtivos = 1000000;     // Inteiro grande (64-bit)
double preco = 150.50;             // Decimal com ponto flutuante
decimal salario = 5000.00m;        // Dinheiro - preciso!
bool ativo = true;                 // Verdadeiro/Falso
char categoria = 'A';              // Um caractere

DateTime dataInicio = DateTime.Now; // Data e hora
TimeSpan duracao = TimeSpan.FromDays(30); // Intervalo de tempo

// ✅ Tipos de Referência (apontam para objeto na memória)
string nome = "Empresa XYZ";       // Texto
object[] dados = new object[10];   // Array de qualquer coisa
List<int> consumos = new List<int>(); // Lista dinâmica
```

**Regra**: Use `decimal` para dinheiro, nunca `double`!

## 2️⃣ Classes e Propriedades

```csharp
// ❌ Forma antiga (C# 4.0)
public class Cliente
{
    private string _nome;
    
    public string GetNome() { return _nome; }
    public void SetNome(string nome) { _nome = nome; }
}

// ✅ Forma moderna (Auto-properties)
public class Cliente
{
    public int Id { get; set; }           // Propriedade automática
    public string Nome { get; set; }      // Getter/Setter automáticos
    public decimal ConsumoMedio { get; set; }
    public string Regiao { get; set; }
    public DateTime CriadoEm { get; set; }
}

// ✅ Propriedade somente leitura (ao construir)
public class Contrato
{
    public int Id { get; private set; }   // Só pode ser set internamente
    public DateTime DataCriacao { get; } = DateTime.Now;
    public string Fornecedor { get; set; }
}
```

## 3️⃣ Null Coalescing e Null-Safe

```csharp
// ❌ Forma antiga - verifica null manualmente
string descricao = cliente.Descricao;
if (descricao == null)
    descricao = "Sem descrição";

// ✅ Operador ?? (null coalescing)
string descricao = cliente.Descricao ?? "Sem descrição";

// ✅ Operador ?. (null-safe navigation)
decimal consumo = cliente?.ConsumoMedio ?? 0;
// Se cliente é null, retorna 0. Caso contrário, retorna ConsumoMedio

// ✅ Property null (C# 8.0+)
#nullable enable
public class Cliente
{
    public string? Descricao { get; set; } // Pode ser null
    public string Nome { get; set; }       // Nunca é null
}
```

## 4️⃣ Async/Await - Operações Não-Bloqueantes

Este é o conceito mais importante para APIs!

```csharp
// ❌ Forma bloqueante (trava enquanto aguarda)
public ClienteDto GetCliente(int id)
{
    // Enquanto isso aguarda, nenhuma requisição pode ser processada!
    var cliente = _repository.GetClienteFromDatabase(id);
    return new ClienteDto { Id = cliente.Id, Nome = cliente.Nome };
}

// ✅ Forma assíncrona (não bloqueia)
public async Task<ClienteDto> GetClienteAsync(int id)
{
    // Enquanto aguarda o BD, a thread fica disponível para outras requisições!
    var cliente = await _repository.GetClienteByIdAsync(id);
    
    if (cliente == null)
        return null;
        
    return new ClienteDto { Id = cliente.Id, Nome = cliente.Nome };
}

// Cliente HTTP (Angular/Frontend) aguarda
var resposta = await axios.get('/api/clientes/1');
console.log(resposta.data.nome); // "Empresa XYZ"
```

**Regra: Toda operação de I/O (BD, API, arquivo) deve ser async!**

```csharp
// Controller
[HttpGet("{id}")]
public async Task<ActionResult<ClienteDto>> GetCliente(int id)
{
    var cliente = await _service.GetClienteByIdAsync(id);
    return Ok(cliente);
}

// Service
public async Task<ClienteDto> GetClienteByIdAsync(int id)
{
    var cliente = await _repository.GetByIdAsync(id); // Aguarda
    return new ClienteDto { ... };
}

// Repository
public async Task<Cliente> GetByIdAsync(int id)
{
    return await _context.Clientes
        .FirstOrDefaultAsync(c => c.Id == id); // Aguarda BD
}
```

## 5️⃣ LINQ - Consultas em Coleções

LINQ = Language Integrated Query (SQL within C#)

```csharp
List<Cliente> clientes = new List<Cliente>
{
    new Cliente { Id = 1, Nome = "Empresa A", ConsumoMedio = 100 },
    new Cliente { Id = 2, Nome = "Empresa B", ConsumoMedio = 250 },
    new Cliente { Id = 3, Nome = "Empresa C", ConsumoMedio = 75 }
};

// ✅ Filtrar (WHERE)
var consumoBaixo = clientes
    .Where(c => c.ConsumoMedio < 100)  // c : Cliente iterado
    .ToList();  // [Empresa C]

// ✅ Mapear (SELECT)
var nomes = clientes
    .Select(c => c.Nome)
    .ToList();  // ["Empresa A", "Empresa B", "Empresa C"]

// ✅ Ordenar (ORDER BY)
var ordenado = clientes
    .OrderByDescending(c => c.ConsumoMedio)
    .ToList();  // [Empresa B, Empresa A, Empresa C]

// ✅ Combinar operações (fluent syntax)
var resultado = clientes
    .Where(c => c.ConsumoMedio > 100)     // Filtro
    .OrderBy(c => c.Nome)                 // Ordenar
    .Select(c => c.Nome)                  // Projetar
    .ToList();  // ["Empresa B"]

// ✅ LINQ no Entity Framework (BD)
public async Task<List<ClienteDto>> GetClientesPorRegioAsync(string regiao)
{
    var clientes = await _context.Clientes
        .Where(c => c.Regiao == regiao)
        .Select(c => new ClienteDto
        {
            Id = c.Id,
            Nome = c.Nome,
            ConsumoMedio = c.ConsumoMedio
        })
        .ToListAsync();  // Aguarda e retorna
    
    return clientes;
}
```

## 6️⃣ Entity Framework - ORM (Object-Relational Mapping)

Entity Framework converte objetos C# em SQL automaticamente!

```csharp
// Modelo (Entidade)
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public decimal ConsumoMedio { get; set; }
}

// DbContext (representa o BD)
public class ApplicationDbContext : DbContext
{
    public DbSet<Cliente> Clientes { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseMySql("Server=localhost;Database=energy_hub;User=root;Password=...;");
    }
}

// Operações
public class ClienteRepository
{
    private readonly ApplicationDbContext _context;

    // ✅ CREATE (Inserir)
    public async Task AddAsync(Cliente cliente)
    {
        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        // SQL gerado: INSERT INTO Clientes (...) VALUES (...)
    }

    // ✅ READ (Ler)
    public async Task<Cliente> GetByIdAsync(int id)
    {
        return await _context.Clientes.FindAsync(id);
        // SQL gerado: SELECT * FROM Clientes WHERE Id = @id
    }

    // ✅ UPDATE (Atualizar)
    public async Task UpdateAsync(Cliente cliente)
    {
        _context.Clientes.Update(cliente);
        await _context.SaveChangesAsync();
        // SQL gerado: UPDATE Clientes SET ... WHERE Id = @id
    }

    // ✅ DELETE (Deletar)
    public async Task DeleteAsync(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        // SQL gerado: DELETE FROM Clientes WHERE Id = @id
    }
}
```

## 7️⃣ Dependency Injection (DI)

DI = injetar dependências ao invés de criar manualmente

```csharp
// ❌ Sem DI (difícil testar)
public class ClienteController
{
    private ClienteRepository _repository = new ClienteRepository();
    
    public void GetCliente(int id)
    {
        // Se _repository mudar, preciso atualizar aqui também
        var cliente = _repository.GetById(id);
    }
}

// ✅ Com DI (fácil testar)
public interface IClienteRepository
{
    Task<Cliente> GetByIdAsync(int id);
}

public class ClienteRepository : IClienteRepository
{
    public async Task<Cliente> GetByIdAsync(int id) { ... }
}

public class ClienteController
{
    private readonly IClienteRepository _repository;
    
    // Injeção via constructor
    public ClienteController(IClienteRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<ClienteDto> GetCliente(int id)
    {
        var cliente = await _repository.GetByIdAsync(id);
        return new ClienteDto { ... };
    }
}

// Configuração em Program.cs
var builder = WebApplicationBuilder.CreateBuilder(args);

// Registrar serviços
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.Run();
```

## 8️⃣ Tratamento de Exceções

```csharp
// ✅ Try-Catch-Finally
try
{
    var cliente = await _repository.GetByIdAsync(id);
    if (cliente == null)
        throw new InvalidOperationException("Cliente não encontrado");
        
    return Ok(cliente);
}
catch (InvalidOperationException ex)
{
    return NotFound(new { mensagem = ex.Message });
}
catch (Exception ex)
{
    // Log da exceção
    _logger.LogError(ex, "Erro ao buscar cliente");
    return StatusCode(500, new { mensagem = "Erro interno" });
}

// ✅ Usando numéricos null-safe
public async Task<decimal> CalcularConsumoAsync(int clienteId)
{
    try
    {
        var consumo = await _repository.GetConsumoAsync(clienteId)
            ?? throw new InvalidOperationException("Consumo não encontrado");
        
        return consumo;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Erro ao calcular consumo para cliente {ClienteId}", clienteId);
        throw;
    }
}
```

## 9️⃣ Status Codes HTTP

```csharp
[ApiController]
[Route("api/[controller]")]
public class ClientesController
{
    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(int id)
    {
        var cliente = await _service.GetClienteByIdAsync(id);
        
        if (cliente == null)
            return NotFound();  // 404 - Não encontrado
            
        return Ok(cliente);     // 200 - Sucesso
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
    {
        var cliente = await _service.CreateClienteAsync(dto);
        
        return CreatedAtAction(nameof(GetCliente), 
            new { id = cliente.Id }, 
            cliente);  // 201 - Criado
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(int id, UpdateClienteDto dto)
    {
        await _service.UpdateClienteAsync(id, dto);
        
        return NoContent();  // 204 - Sem conteúdo (sucesso mas sem retorno)
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        await _service.DeleteClienteAsync(id);
        
        return NoContent();  // 204
    }
}
```

## 🔟 Validação com Data Annotations

```csharp
using System.ComponentModel.DataAnnotations;

public class CreateClienteDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, MinimumLength = 3)]
    public string Nome { get; set; }

    [Required]
    [RegularExpression(@"\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}")]
    public string Cnpj { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Consumo deve ser maior que 0")]
    public decimal ConsumoMedio { get; set; }

    [Required]
    public string Regiao { get; set; }
}

// Controller valida automaticamente
[HttpPost]
public async Task<ActionResult<ClienteDto>> CreateCliente(CreateClienteDto dto)
{
    // Se dto for inválido, retorna 400 automaticamente
    if (!ModelState.IsValid)
        return BadRequest(ModelState);  // 400
        
    var cliente = await _service.CreateClienteAsync(dto);
    return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
}
```

## 📌 Resumo: Estrutura Típica do EnergyHub

```
ProductionDbContext
├── Clientes { Id, Nome, Cnpj, ConsumoMedio, Regiao }
└── Contratos { Id, ClienteId, Fornecedor, PrecoMwh, DataInicio, DataFim }

ClienteService
├── GetClienteByIdAsync(id) → Task<ClienteDto>
├── GetAllClientesAsync() → Task<List<ClienteDto>>
├── CreateClienteAsync(dto) → Task<ClienteDto>
├── UpdateClienteAsync(id, dto) → Task<ClienteDto>
└── DeleteClienteAsync(id) → Task<bool>

ClienteController
├── GET /api/clientes → List<ClienteDto>
├── GET /api/clientes/{id} → ClienteDto
├── POST /api/clientes → ClienteDto
├── PUT /api/clientes/{id} → ClienteDto
└── DELETE /api/clientes/{id} → 204 NoContent
```

C# é uma linguagem poderosa e expressiva. O importante é entender que:
- ✅ Async/await para operações de I/O
- ✅ LINQ para transformações de dados
- ✅ Entity Framework para acesso rápido ao BD
- ✅ Dependency Injection para código testável
