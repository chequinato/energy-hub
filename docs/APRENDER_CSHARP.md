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

---

## 1️⃣1️⃣ Fundamentos da Orientação a Objetos

### 🧱 Classes vs Structs

```csharp
// ✅ Classe (tipo referência) - armazenada no heap
public class Cliente
{
    public string Nome { get; set; }
    public decimal ConsumoMedio { get; set; }
}

// ✅ Struct (tipo valor) - armazenada na stack, mais leve
public struct Coordenada
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

// 💡 Quando usar Struct?
// - Quando o objeto é pequeno e imutável
// - Quando não precisa de herança
// - Ex: coordenadas, cores, datas
```

### 📋 Interfaces (Contratos)

**Analogia**: Interface é como um contrato de trabalho. Quem assina (implementa) precisa cumprir todas as cláusulas.

```csharp
// ✅ Definindo o contrato
public interface IClienteRepository
{
    Task<Cliente> GetByIdAsync(int id);
    Task<List<Cliente>> GetAllAsync();
    Task AddAsync(Cliente cliente);
}

// ✅ Implementando o contrato
public class ClienteRepository : IClienteRepository
{
    public async Task<Cliente> GetByIdAsync(int id) { /* ... */ }
    public async Task<List<Cliente>> GetAllAsync() { /* ... */ }
    public async Task AddAsync(Cliente cliente) { /* ... */ }
}

// ✅ Usando o contrato (não liga pra implementação!)
public class ClienteService
{
    private readonly IClienteRepository _repository;
    
    public ClienteService(IClienteRepository repository)
    {
        _repository = repository; // Pode ser ClienteRepository, ClienteRepositoryMock, etc.
    }
}
```

### 🔒 Encapsulamento (Proteger os dados)

```csharp
public class Cliente
{
    // ✅ Campo privado - ninguém acessa direto
    private decimal _consumoMedio;
    
    // ✅ Propriedade pública com regra de negócio
    public decimal ConsumoMedio 
    { 
        get => _consumoMedio;
        set 
        {
            // Regra: consumo não pode ser negativo
            if (value < 0)
                throw new ArgumentException("Consumo não pode ser negativo");
            
            _consumoMedio = value;
        }
    }
    
    // ✅ Propriedade somente leitura (calculada)
    public bool ElegivelMercadoLivre => ConsumoMedio > 100;
}

// Uso
var cliente = new Cliente();
cliente.ConsumoMedio = 150; // ✅ Funciona
// cliente.ConsumoMedio = -10; // ❌ Throws exception!
```

### 👨‍👦 Herança (É-um)

```csharp
// ✅ Classe base
public class Entidade
{
    public int Id { get; set; }
    public DateTime CriadoEm { get; set; }
}

// ✅ Herdando (Cliente É uma Entidade)
public class Cliente : Entidade
{
    public string Nome { get; set; }
    public string Cnpj { get; set; }
}

// ✅ Herdando também
public class Contrato : Entidade
{
    public string Fornecedor { get; set; }
    public decimal PrecoMwh { get; set; }
}
```

### 🎭 Polimorfismo (Muitas formas)

```csharp
// ✅ Classe abstrata (não pode ser instanciada)
public abstract class Relatorio
{
    public abstract string Gerar(); // Cada um implementa do seu jeito
}

public class RelatorioPdf : Relatorio
{
    public override string Gerar() => "Gerando PDF...";
}

public class RelatorioExcel : Relatorio
{
    public override string Gerar() => "Gerando Excel...";
}

// ✅ Polimorfismo em ação
public void EnviarRelatorio(Relatorio relatorio) // Aceita QUALQUER tipo de relatório
{
    Console.WriteLine(relatorio.Gerar()); // Chama o método correto automaticamente
}

// Uso
EnviarRelatorio(new RelatorioPdf());   // "Gerando PDF..."
EnviarRelatorio(new RelatorioExcel()); // "Gerando Excel..."
```

---

## 1️⃣2️⃣ C# Moderno

### 🧬 Generics (Tipos genéricos)

**Analogia**: Ao invés de fazer uma fila só para pão, uma fila só para leite... faz uma fila que serve QUALQUER coisa!

```csharp
// ❌ Sem generics - repetição de código
public class RepositorioClientes { public List<Cliente> Listar() { ... } }
public class RepositorioContratos { public List<Contrato> Listar() { ... } }

// ✅ Com generics - um só serve para todos!
public class Repositorio<T> where T : class
{
    private List<T> _itens = new();
    
    public void Adicionar(T item) => _itens.Add(item);
    public List<T> Listar() => _itens;
    public T Buscar(Func<T, bool> predicado) => _itens.FirstOrDefault(predicado);
}

// Uso
var repoClientes = new Repositorio<Cliente>();
var repoContratos = new Repositorio<Contrato>();
```

### ⚡ Lambdas (Funções anônimas curtas)

```csharp
List<Cliente> clientes = new() { /* ... */ };

// ❌ Sem lambda - verboso
clientes.Where(delegate(Cliente c) { return c.ConsumoMedio > 100; });

// ✅ Com lambda - limpo e direto
clientes.Where(c => c.ConsumoMedio > 100);

// ✅ Lambda com múltiplas operações
var resultado = clientes
    .Where(c => c.ConsumoMedio > 100)
    .OrderBy(c => c.Nome)
    .Select(c => new { c.Nome, c.ConsumoMedio }); // Anonymous type

// ✅ Lambda em variável
Func<decimal, decimal> calcularDesconto = preco => preco * 0.9m;
var precoComDesconto = calcularDesconto(100); // 90
```

### 🔧 Extension Methods (Métodos de extensão)

```csharp
// ✅ Adiciona métodos em tipos existentes sem herança!
public static class StringExtensions
{
    public static string ToCnpjFormatado(this string cnpj)
    {
        return $"{cnpj.Substring(0, 2)}.{cnpj.Substring(2, 3)}.{cnpj.Substring(5, 3)}/{cnpj.Substring(8, 4)}-{cnpj.Substring(12, 2)}";
    }
    
    public static bool IsNullOrEmpty(this string str) => string.IsNullOrEmpty(str);
}

// Uso
var cnpj = "12345678000190";
Console.WriteLine(cnpj.ToCnpjFormatado()); // "12.345.678/0001-90"
```

---

## 1️⃣3️⃣ Async/Performance

### 🧵 Task vs Thread

```csharp
// ❌ Thread (custo alto - cria novo processo leve)
Thread thread = new Thread(() => {
    // Executa em paralelo, mas consome recurso do SO
});
thread.Start();

// ✅ Task (mais leve - usa Thread Pool)
Task task = Task.Run(() => {
    // Executa em paralelo, reutiliza threads existentes
});

// ✅ Task com retorno (o mais comum em APIs)
Task<Cliente> task = _repository.GetByIdAsync(1);
var cliente = await task; // Espera sem travar a thread principal!
```

**Regra de ouro**: Use `Task` para I/O (banco, API, arquivo). Use `Thread` só para processamento pesado de CPU.

### 🏊 Thread Pool (Piscina de Threads)

```csharp
// ✅ O .NET gerencia automaticamente!
// Quando você faz await, a thread volta pro pool para atender outra requisição

public async Task<List<Cliente>> GetClientesAsync()
{
    // A thread fica livre enquanto o banco responde
    return await _context.Clientes.ToListAsync();
}

// ✅ Parallel.ForEach (quando precisa processar muitos dados em paralelo)
public decimal CalcularEconomiaTotal(List<Contrato> contratos)
{
    decimal total = 0;
    
    Parallel.ForEach(contratos, contrato =>
    {
        var economia = CalcularEconomia(contrato);
        Interlocked.Add(ref total, economia); // Thread-safe addition
    });
    
    return total;
}
```

### ⛔ Deadlocks (Evitar!)

```csharp
// ❌ PERIGO: .Result pode causar deadlock!
public Cliente GetClientePerigoso(int id)
{
    return _repository.GetByIdAsync(id).Result; // ⚠️ Pode travar!
}

// ✅ SEMPRE use await no caminho completo
public async Task<Cliente> GetClienteSeguro(int id)
{
    return await _repository.GetByIdAsync(id); // ✅ Seguro
}

// ✅ ConfigureAwait(false) em bibliotecas (não em controllers!)
public async Task<Cliente> GetByIdAsync(int id)
{
    return await _context.Clientes
        .FirstOrDefaultAsync(c => c.Id == id)
        .ConfigureAwait(false); // Não precisa voltar pro contexto original
}
```

---

## 1️⃣4️⃣ Dados Avançado

### 🔍 IEnumerable vs IQueryable

```csharp
// ✅ IEnumerable (filtra em MEMÓRIA - carrega TUDO primeiro)
IEnumerable<Cliente> clientes = _context.Clientes; // SELECT * FROM Clientes
var filtrados = clientes.Where(c => c.ConsumoMedio > 100); // Filtra em C#

// ✅ IQueryable (filtra no BANCO - SQL otimizado)
IQueryable<Cliente> query = _context.Clientes; // Não executa ainda!
var filtrados = query.Where(c => c.ConsumoMedio > 100); // SQL: WHERE ConsumoMedio > 100

// 💡 Sempre use IQueryable para filtros dinâmicos
public IQueryable<Cliente> FiltrarClientes(string regiao, decimal? consumoMinimo)
{
    IQueryable<Cliente> query = _context.Clientes.AsQueryable();
    
    if (!string.IsNullOrEmpty(regiao))
        query = query.Where(c => c.Regiao == regiao);
    
    if (consumoMinimo.HasValue)
        query = query.Where(c => c.ConsumoMedio >= consumoMinimo.Value);
    
    return query; // SQL será montado dinamicamente!
}
```

### 👁️ Tracking vs No-Tracking

```csharp
// ✅ Tracking (padrão) - EF monitora mudanças
public async Task AtualizarCliente(int id, string nome)
{
    var cliente = await _context.Clientes.FindAsync(id); // Tracked
    cliente.Nome = nome; // EF detecta a mudança
    await _context.SaveChangesAsync(); // UPDATE automático
}

// ✅ No-Tracking (mais rápido) - só leitura
public async Task<List<ClienteDto>> ListarClientesAsync()
{
    return await _context.Clientes
        .AsNoTracking() // Não monitora = mais performance!
        .Select(c => new ClienteDto { Id = c.Id, Nome = c.Nome })
        .ToListAsync();
}

// 💡 Regra: Use AsNoTracking() para consultas de leitura (dashboards, listas)
```

---

## 1️⃣5️⃣ SOLID Principles

### S - Single Responsibility (Uma responsabilidade)

```csharp
// ❌ Ruim: Controller fazendo tudo
public class ClienteController : ControllerBase
{
    public async Task<IActionResult> Create(CreateClienteDto dto)
    {
        // Validação
        if (string.IsNullOrEmpty(dto.Nome))
            return BadRequest();
        
        // Regra de negócio
        if (dto.ConsumoMedio < 0)
            return BadRequest();
        
        // Acesso ao banco
        var cliente = new Cliente { ... };
        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        
        // Resposta
        return Ok(cliente);
    }
}

// ✅ Bom: Cada um com sua responsabilidade
public class ClienteController : ControllerBase
{
    private readonly IClienteService _service;
    
    public ClienteController(IClienteService service) => _service = service;
    
    [HttpPost]
    public async Task<IActionResult> Create(CreateClienteDto dto)
    {
        var resultado = await _service.CreateAsync(dto); // Só orquestra!
        return CreatedAtAction(nameof(Get), new { id = resultado.Id }, resultado);
    }
}
// Service: regra de negócio | Repository: acesso ao banco | DTO: validação
```

### O - Open/Closed (Aberto pra extensão, fechado pra modificação)

```csharp
// ❌ Ruim: toda vez que adicionar tipo, muda o método
public decimal CalcularDesconto(string tipoCliente, decimal valor)
{
    if (tipoCliente == "Premium") return valor * 0.9m;
    if (tipoCliente == "Gold") return valor * 0.95m;
    return valor; // Muda toda vez!
}

// ✅ Bom: extensível sem modificar
public interface IDescontoStrategy
{
    decimal AplicarDesconto(decimal valor);
}

public class DescontoPremium : IDescontoStrategy
{
    public decimal AplicarDesconto(decimal valor) => valor * 0.9m;
}

public class CalculadoraDesconto(IDescontoStrategy strategy)
{
    public decimal Calcular(decimal valor) => strategy.AplicarDesconto(valor);
}
```

### L - Liskov Substitution (Classe filha substitui pai sem quebrar)

```csharp
// ✅ ClientePremium é um Cliente, mas funciona em qualquer lugar que Cliente funciona
public class ClienteRepository : IClienteRepository { ... }

public class ClienteRepositoryCache : IClienteRepository
{
    // Pode substituir ClienteRepository sem quebrar nada!
    // Mesmo contrato, comportamento diferente (com cache)
}
```

### I - Interface Segregation (Interfaces pequenas e específicas)

```csharp
// ❌ Ruim: interface gigante
public interface IRepository<T>
{
    Task<T> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<List<T>> SearchAsync(string termo);
    Task ExportarParaExcelAsync();
    Task ImportarDoExcelAsync();
}

// ✅ Bom: interfaces pequenas
public interface IRepository<T> { Task<T> GetByIdAsync(int id); Task AddAsync(T entity); }
public interface ISearchable<T> { Task<List<T>> SearchAsync(string termo); }
public interface IExportavel<T> { Task ExportarParaExcelAsync(); }
```

### D - Dependency Inversion (Depender de abstrações)

```csharp
// ❌ Ruim: depende de implementação concreta
public class ClienteService
{
    private readonly ClienteRepository _repository = new(); // Acoplado!
}

// ✅ Bom: depende de abstração (interface)
public class ClienteService
{
    private readonly IClienteRepository _repository;
    
    public ClienteService(IClienteRepository repository) // Injetado!
    {
        _repository = repository;
    }
}
```

---

## 1️⃣6️⃣ Dependency Injection - Lifetimes

### ⏱️ Scoped (Um por requisição HTTP)

```csharp
// ✅ DbContext deve ser Scoped
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ApplicationDbContext>();

// Cada requisição HTTP cria uma nova instância
// Requisição 1: ClienteRepository #1
// Requisição 2: ClienteRepository #2 (diferente!)
```

### 🌍 Singleton (Uma só pra aplicação inteira)

```csharp
// ✅ Serviços que não mudam de estado
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<ILoggerFactory, LoggerFactory>();

// Mesma instância para TODAS as requisições
// Cuidado: problemas com threads se tiver estado mutável!
```

### ⚡ Transient (Novo toda vez que pedir)

```csharp
// ✅ Serviços leves e sem estado
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IPdfGenerator, PdfGenerator>();

// Cada vez que injetar, cria novo
// Requisição 1 injeta 2x: EmailService #1 e #2 (diferentes!)
```

### 🎯 Resumo Visual

```
Requisição HTTP 1:
├── Scoped: ClienteRepository #A
│   ├── Transient: EmailService #1
│   └── Transient: EmailService #2 (nova!)
└── Singleton: CacheService #1 (sempre a mesma)

Requisição HTTP 2:
├── Scoped: ClienteRepository #B (nova!)
│   ├── Transient: EmailService #3
│   └── Transient: EmailService #4 (nova!)
└── Singleton: CacheService #1 (mesma!)
```

---

## 1️⃣7️⃣ ASP.NET Core Web

### 🛤️ Middleware Pipeline (Esteira de processamento)

```
Request → Logger → Autenticação → Routing → Controller → Response
              ↑___________________________|
```

```csharp
// ✅ Program.cs - ordem importa!
var app = builder.Build();

app.UseHttpsRedirection();      // 1. Redireciona HTTPS
app.UseCors("AllowAll");        // 2. Libera CORS antes de auth
app.UseAuthentication();        // 3. Quem é você? (JWT)
app.UseAuthorization();         // 4. O que pode fazer?
app.MapControllers();           // 5. Rotas dos controllers

// 💡 Se inverter UseAuthentication e UseAuthorization, não funciona!
```

### 🔍 Filters (Filtros)

```csharp
// ✅ Action Filter - executa antes/depois de cada action
public class LogFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        Console.WriteLine($"→ Requisição {context.ActionDescriptor.ActionName} iniciada");
    }
    
    public void OnActionExecuted(ActionExecutedContext context)
    {
        Console.WriteLine($"← Requisição finalizada com {context.HttpContext.Response.StatusCode}");
    }
}

// ✅ Usando no controller
[ServiceFilter(typeof(LogFilter))]
public class ClientesController : ControllerBase { ... }

// ✅ Filtros built-in
[Authorize]        // Só permite se autenticado
[AllowAnonymous]   // Permite sem autenticação
[ValidateAntiForgeryToken] // Proteção CSRF
```

### 📝 Model Binding (Conversão automática)

```csharp
// ✅ JSON → Objeto C# automático!
[HttpPost]
public IActionResult Create([FromBody] CreateClienteDto dto) // JSON vira objeto
{
    // dto já está populado!
}

// ✅ Outras fontes
public IActionResult Get(
    [FromRoute] int id,           // /api/clientes/123
    [FromQuery] string nome,      // ?nome=Empresa
    [FromHeader] string apiKey    // Header: X-API-Key
)
```

---

## 1️⃣8️⃣ Qualidade - Unit Testing

### 🧪 Testes Unitários com xUnit

```csharp
// ✅ Testando Service isoladamente
public class ClienteServiceTests
{
    private readonly Mock<IClienteRepository> _mockRepo;
    private readonly ClienteService _service;

    public ClienteServiceTests()
    {
        _mockRepo = new Mock<IClienteRepository>();
        _service = new ClienteService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetByIdAsync_ClienteExiste_RetornaCliente()
    {
        // Arrange (preparar)
        var clienteEsperado = new Cliente { Id = 1, Nome = "Empresa A" };
        _mockRepo.Setup(r => r.GetByIdAsync(1))
                 .ReturnsAsync(clienteEsperado);

        // Act (executar)
        var resultado = await _service.GetByIdAsync(1);

        // Assert (verificar)
        Assert.NotNull(resultado);
        Assert.Equal("Empresa A", resultado.Nome);
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ConsumoNegativo_LancaExcecao()
    {
        // Arrange
        var dto = new CreateClienteDto { ConsumoMedio = -10 };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.CreateAsync(dto));
    }
}
```

### 🎭 Mocking com Moq

```csharp
// ✅ Mock simula o comportamento sem acessar o banco real!
var mockRepo = new Mock<IClienteRepository>();

// Configurar retorno
mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
        .ReturnsAsync(new Cliente { Id = 1 });

// Verificar se método foi chamado
mockRepo.Verify(r => r.AddAsync(It.Is<Cliente>(c => c.Nome == "Teste")), Times.Once);

// 💡 Por que mockar?
// - Testes rápidos (sem banco)
// - Testes confiáveis (sem dados externos)
// - Testar cenários de erro (simular exceptions)
```

---

## 1️⃣9️⃣ Avançado

### 🏷️ Attributes (Metadados)

```csharp
// ✅ Criando atributo customizado
[AttributeUsage(AttributeTargets.Method)]
public class RequireRoleAttribute : Attribute
{
    public string Role { get; }
    public RequireRoleAttribute(string role) => Role = role;
}

// ✅ Usando
[RequireRole("Admin")]
[HttpDelete("{id}")]
public IActionResult Delete(int id) { ... }

// ✅ Attributes built-in importantes
[ApiController]           // Habilita validação automática
[Route("api/[controller]")] // Template de rota
[HttpGet] [HttpPost]      // Métodos HTTP
[FromBody] [FromRoute]    // Binding
[Required] [StringLength] // Validação
```

### 🗑️ Memory Management (Garbage Collector)

```csharp
// ✅ IDisposable - libera recursos manualmente
public class LeitorArquivo : IDisposable
{
    private FileStream _stream;
    
    public LeitorArquivo(string path)
    {
        _stream = File.OpenRead(path);
    }
    
    public void Dispose()
    {
        _stream?.Dispose(); // Libera arquivo!
    }
}

// ✅ using statement (libera automaticamente)
using (var leitor = new LeitorArquivo("dados.txt"))
{
    // Usa o leitor...
} // Dispose() chamado automaticamente!

// ✅ using declaration (C# 8.0+)
using var leitor2 = new LeitorArquivo("dados.txt");
// Dispose() no final do escopo

// 💡 Dica: DbContext já implementa IDisposable!
// Nunca precisa dar Dispose manual se usar DI
```

### 💾 Caching com IMemoryCache

```csharp
public class DashboardService
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationDbContext _context;

    public DashboardService(IMemoryCache cache, ApplicationDbContext context)
    {
        _cache = cache;
        _context = context;
    }

    public async Task<DashboardDto> GetDashboardAsync()
    {
        // ✅ Tenta pegar do cache primeiro
        if (_cache.TryGetValue("dashboard", out DashboardDto cached))
            return cached;

        // ✅ Se não tem, busca no banco
        var dashboard = await CalcularDashboardAsync();

        // ✅ Salva no cache por 5 minutos
        var options = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(5))
            .SetPriority(CacheItemPriority.High);

        _cache.Set("dashboard", dashboard, options);

        return dashboard;
    }
}
```

---

## 📌 Checklist de Domínio

Quando você entender tudo isso, você está **muito além** de estagiário:

- [ ] Interface é um contrato, não implementação
- [ ] Classe = referência, Struct = valor
- [ ] Task é mais leve que Thread
- [ ] await libera a thread, não bloqueia
- [ ] IQueryable gera SQL, IEnumerable não
- [ ] AsNoTracking() para leitura = performance
- [ ] SOLID deixa código fácil de manter
- [ ] Scoped = requisição, Singleton = app, Transient = sempre novo
- [ ] Middleware pipeline tem ordem correta
- [ ] Mock permite testar sem banco
- [ ] using libera recursos automaticamente
- [ ] Cache evita bater no banco toda hora

**Parabéns! Você domina C# moderno! 🚀**
