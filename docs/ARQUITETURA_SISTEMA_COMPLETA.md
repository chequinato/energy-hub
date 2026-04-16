# 🏗️ Arquitetura Completa do Sistema EnergyHub

## 🎯 Visão Geral

O EnergyHub segue uma arquitetura em camadas (Layered Architecture) com padrão Repository + Service, organizada para separar responsabilidades e facilitar a manutenção.

```
Frontend (Angular) ←→ Backend (ASP.NET Core) ←→ Banco de Dados (MySQL)
```

---

## 📂 Estrutura de Pastas e Arquivos

### 🖥️ Backend (EnergyHub.API/)

```
EnergyHub.API/
├── 📁 Controllers/          # Camada de Apresentação
│   ├── AuthController.cs     # Login, Register
│   ├── ClientesController.cs # CRUD de Clientes
│   ├── ContratosController.cs# CRUD de Contratos
│   ├── ConsumoController.cs # CRUD de Consumos
│   └── DashboardController.cs# Dashboard statistics
├── 📁 Services/            # Camada de Negócio
│   ├── Auth/
│   │   ├── PasswordHasher.cs  # Hash de senhas
│   │   └── JwtTokenService.cs # Geração JWT
│   ├── AuthService.cs       # Lógica de autenticação
│   ├── ClienteService.cs    # Regras de negócio de clientes
│   ├── ContratoService.cs   # Regras de negócio de contratos
│   ├── ConsumoService.cs   # Regras de negócio de consumos
│   └── DashboardService.cs  # Lógica do dashboard
├── 📁 Repositories/        # Camada de Acesso a Dados
│   ├── IClienteRepository.cs # Interface do repositório
│   ├── ClienteRepository.cs  # Implementação do repositório
│   ├── IContratoRepository.cs
│   ├── ContratoRepository.cs
│   ├── IConsumoRepository.cs
│   └── ConsumoRepository.cs
├── 📁 DTOs/              # Data Transfer Objects
│   ├── CreateClienteDto.cs   # DTO para criação
│   ├── UpdateClienteDto.cs   # DTO para atualização
│   ├── ClienteDto.cs        # DTO para resposta
│   ├── ClienteDetailDto.cs   # DTO com detalhes
│   ├── CreateContratoDto.cs
│   ├── ContratoDto.cs
│   ├── CreateConsumoDto.cs
│   ├── ConsumoDto.cs
│   ├── EconomiaSimulacaoDto.cs
│   └── DashboardDto.cs
├── 📁 Entities/           # Modelos de Dados
│   ├── Usuario.cs           # Entidade Usuário
│   ├── Cliente.cs          # Entidade Cliente
│   ├── Contrato.cs         # Entidade Contrato
│   └── Consumo.cs         # Entidade Consumo
├── 📁 Data/              # Configuração do Banco
│   └── ApplicationDbContext.cs # Contexto EF Core
├── 📁 Interceptors/       # Interceptadores HTTP
│   └── JwtInterceptor.cs   # Validação JWT
├── Program.cs              # Configuração da aplicação
└── appsettings.json       # Configurações
```

### 🌐 Frontend (energy-hub-ui/src/app/)

```
src/app/
├── 📁 components/         # Componentes Reutilizáveis
│   └── nav/
│       ├── nav.component.ts
│       ├── nav.component.html
│       └── nav.component.css
├── 📁 pages/              # Páginas da Aplicação
│   ├── home/
│   ├── login/
│   ├── dashboard/
│   ├── clientes/
│   ├── contratos/
│   └── consumos/
├── 📁 services/           # Serviços Angular
│   ├── auth.service.ts     # Autenticação
│   └── api.service.ts      # Comunicação com backend
├── 📁 guards/             # Guards de Rota
│   └── auth.guard.ts      # Protege rotas
├── 📁 interceptors/       # Interceptadores HTTP
│   └── auth.interceptor.ts # Inclui token JWT
├── 📁 models/             # Modelos TypeScript
│   ├── cliente.model.ts
│   ├── contrato.model.ts
│   └── consumo.model.ts
├── app.routes.ts          # Configuração de rotas
├── app.config.ts          # Configurações Angular
└── app.ts                # Componente raiz
```

---

## 🔄 Fluxo de Dados Entre Camadas

### 1️⃣ Requisição do Usuário
```
Frontend → HTTP Request → Controller → Service → Repository → Database
```

### 2️⃣ Resposta para o Usuário
```
Database → Repository → Service → Controller → HTTP Response → Frontend
```

---

## 📋 Papel de Cada Arquivo/Camada

### 🎮 Controllers (Camada de Apresentação)
**Responsabilidade:** Controlar requisições HTTP e respostas

**O que faz:**
- Recebe requisições HTTP (GET, POST, PUT, DELETE)
- Valida dados de entrada
- Chama services para executar lógica de negócio
- Retorna respostas HTTP (200, 400, 404, etc.)
- Extrai informações do usuário do token JWT

**Exemplo:**
```csharp
[HttpGet]
public async Task<ActionResult<List<ClienteDto>>> GetClientes()
{
    var userId = GetUserId(); // Extrai do JWT
    var clientes = await _clienteService.GetAllAsync(userId);
    return Ok(clientes);
}
```

**Quando modificar:** Ao criar novos endpoints HTTP

---

### ⚙️ Services (Camada de Negócio)
**Responsabilidade:** Implementar regras de negócio e lógica da aplicação

**O que faz:**
- Implementa validações de negócio
- Orquestra múltiplos repositories
- Transforma entidades em DTOs
- Aplica regras complexas (cálculos, validações)

**Exemplo:**
```csharp
public async Task<ClienteDto> CreateAsync(CreateClienteDto dto, int userId)
{
    // Validação de negócio
    if (dto.ConsumoMedio <= 0)
        throw new ArgumentException("Consumo médio deve ser positivo");
    
    // Cria entidade
    var cliente = await _repository.CreateAsync(dto, userId);
    
    // Transforma em DTO
    return MapToDto(cliente);
}
```

**Quando modificar:** Ao adicionar nova lógica de negócio

---

### 🗄️ Repositories (Camada de Acesso a Dados)
**Responsabilidade:** Acessar e manipular dados no banco

**O que faz:**
- Executa queries SQL (via Entity Framework)
- CRUD básico (Create, Read, Update, Delete)
- Aplica filtros (por usuário, ID, etc.)
- Gerencia transações com o banco

**Exemplo:**
```csharp
public async Task<List<Cliente>> GetAllAsync(int userId)
{
    return await _context.Clientes
        .Where(c => c.UsuarioId == userId) // Filtra por usuário
        .Include(c => c.Contratos)      // Incluir dados relacionados
        .Include(c => c.Consumos)
        .ToListAsync();
}
```

**Quando modificar:** Ao criar novas operações de banco

---

### 📦 DTOs (Data Transfer Objects)
**Responsabilidade:** Definir estrutura de dados transferidos

**O que faz:**
- Define contratos de API
- Separa modelo de banco da API
- Valida dados automaticamente
- Controla o que é exposto externamente

**Tipos de DTOs:**
- **CreateDto:** Dados para criação
- **UpdateDto:** Dados para atualização  
- **ResponseDto:** Dados para resposta
- **DetailDto:** Dados completos com relacionamentos

**Exemplo:**
```csharp
public class CreateClienteDto
{
    [Required]
    [StringLength(200)]
    public string Nome { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Cnpj { get; set; }
    
    [Range(0.01, double.MaxValue)]
    public decimal ConsumoMedio { get; set; }
}
```

**Quando modificar:** Ao criar novos endpoints ou modificar dados da API

---

### 🏗️ Entities (Modelos de Dados)
**Responsabilidade:** Definir estrutura das tabelas do banco

**O que faz:**
- Mapeia para tabelas do banco
- Define relacionamentos (FK)
- Configura validações de banco
- Inclui navegação entre entidades

**Exemplo:**
```csharp
[Table("Clientes")]
public class Cliente
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Nome { get; set; }
    
    public int UsuarioId { get; set; } // FK para usuário
    
    // Navegação
    [ForeignKey("UsuarioId")]
    public Usuario Usuario { get; set; }
    
    public List<Contrato> Contratos { get; set; }
}
```

**Quando modificar:** Ao criar novas tabelas ou modificar estrutura existente

---

### 🗄️ ApplicationDbContext (Contexto do Banco)
**Responsabilidade:** Configurar conexão e mapeamento do Entity Framework

**O que faz:**
- Define string de conexão
- Configura relacionamentos
- Cria migrations
- Gerencia transações

**Exemplo:**
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Contrato> Contratos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configura relacionamentos
        modelBuilder.Entity<Cliente>()
            .HasOne(c => c.Usuario)
            .WithMany()
            .HasForeignKey(c => c.UsuarioId);
    }
}
```

**Quando modificar:** Ao adicionar novas entidades ou configurar relacionamentos

---

## 🚀 Guia Prático: Onde Modificar o Quê

### 🆕 Para Adicionar Nova Funcionalidade:

#### 1. **Criar Entidade** (Entities/)
```csharp
// Exemplo: Produto.cs
[Table("Produtos")]
public class Produto
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public string Nome { get; set; }
    
    public decimal Preco { get; set; }
    
    public int UsuarioId { get; set; } // Sempre incluir!
    
    public Usuario Usuario { get; set; }
}
```

#### 2. **Criar DTOs** (DTOs/)
```csharp
// CreateProdutoDto.cs
public class CreateProdutoDto
{
    [Required]
    public string Nome { get; set; }
    
    [Range(0.01, double.MaxValue)]
    public decimal Preco { get; set; }
}

// ProdutoDto.cs
public class ProdutoDto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public decimal Preco { get; set; }
}
```

#### 3. **Criar Repository** (Repositories/)
```csharp
// IProdutoRepository.cs
public interface IProdutoRepository
{
    Task<List<Produto>> GetAllAsync(int userId);
    Task<Produto?> GetByIdAsync(int id, int userId);
    Task<Produto> CreateAsync(CreateProdutoDto dto, int userId);
    Task<Produto?> UpdateAsync(int id, UpdateProdutoDto dto, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}

// ProdutoRepository.cs
public class ProdutoRepository : IProdutoRepository
{
    private readonly ApplicationDbContext _context;
    
    public ProdutoRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<List<Produto>> GetAllAsync(int userId)
    {
        return await _context.Produtos
            .Where(p => p.UsuarioId == userId)
            .ToListAsync();
    }
    
    // Implementar outros métodos...
}
```

#### 4. **Criar Service** (Services/)
```csharp
// IProdutoService.cs
public interface IProdutoService
{
    Task<List<ProdutoDto>> GetAllAsync(int userId);
    Task<ProdutoDto?> GetByIdAsync(int id, int userId);
    Task<ProdutoDto> CreateAsync(CreateProdutoDto dto, int userId);
}

// ProdutoService.cs
public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _repository;
    
    public ProdutoService(IProdutoRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<List<ProdutoDto>> GetAllAsync(int userId)
    {
        var produtos = await _repository.GetAllAsync(userId);
        return produtos.Select(MapToDto).ToList();
    }
    
    private ProdutoDto MapToDto(Produto produto)
    {
        return new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            Preco = produto.Preco
        };
    }
}
```

#### 5. **Criar Controller** (Controllers/)
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Sempre incluir autenticação!
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _service;
    
    public ProdutosController(IProdutoService service)
    {
        _service = service;
    }
    
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim);
    }
    
    [HttpGet]
    public async Task<ActionResult<List<ProdutoDto>>> GetProdutos()
    {
        var userId = GetUserId();
        var produtos = await _service.GetAllAsync(userId);
        return Ok(produtos);
    }
    
    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> CreateProduto(CreateProdutoDto dto)
    {
        var userId = GetUserId();
        var produto = await _service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
    }
}
```

#### 6. **Configurar no Program.cs**
```csharp
// Adicionar services
builder.Services.AddScoped<IProdutoRepository, ProdutoRepository>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
```

#### 7. **Criar Migration**
```bash
dotnet ef migrations add AddProdutos
dotnet ef database update
```

---

## 🔧 Boas Práticas e Padrões

### ✅ Sempre Fazer:
- **Incluir `UsuarioId`** em todas as entidades que pertencem a usuários
- **Usar DTOs** para comunicação com a API
- **Validar dados** tanto no frontend quanto no backend
- **Filtrar por `userId`** em todos os repositories
- **Usar interfaces** para repositories e services
- **Incluir `[Authorize]`** em todos os controllers (exceto login/register)

### ❌ Nunca Fazer:
- **Retornar entidades diretamente** dos controllers
- **Esquecer de filtrar por usuário**
- **Armazenar senhas em texto claro**
- **Esquecer de validar dados de entrada**
- **Ignorar tratamento de erros**

---

## 🎯 Resumo do Fluxo de Desenvolvimento

### Para implementar autenticação JWT:
1. **Entities/Usuario.cs** - Modelo de usuário
2. **Services/Auth/PasswordHasher.cs** - Hash de senhas
3. **Services/Auth/JwtTokenService.cs** - Geração de tokens
4. **Controllers/AuthController.cs** - Endpoints login/register
5. **Program.cs** - Configurar JWT

### Para adicionar nova funcionalidade:
1. **Entities/** - Criar modelo de dados
2. **DTOs/** - Criar DTOs de entrada/saída
3. **Repositories/** - Criar acesso a dados
4. **Services/** - Implementar lógica de negócio
5. **Controllers/** - Criar endpoints HTTP
6. **Program.cs** - Registrar DI
7. **Migration** - Atualizar banco

**Resultado:** Arquitetura robusta, escalável e fácil de manter! 🚀
