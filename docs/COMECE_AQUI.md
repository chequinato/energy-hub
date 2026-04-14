# 🎯 Comece Aqui - Guia de Estudo do EnergyHub

Bem-vindo! Você está aprendendo as tecnologias essenciais para o estágio no Itaú. Este guia organiza o estudo de forma progressiva.

## 📚 Arquivos de Estudo

### 1️⃣ ENTENDER_ARQUITETURA.md (Leia Primeiro!)
**Tempo**: ~30 minutos | **O que aprende**: Como o projeto é organizado

Este é o **mais importante**. Explica:
- Padrão de 3 camadas (Controller → Service → Repository)
- Como os dados fluem no EnergyHub
- O que cada camada faz
- Por que separamos em camadas

**Quando ler**: Antes de qualquer coisa. Entender a arquitetura te ajuda a entender o resto.

---

### 2️⃣ APRENDER_CSHARP.md (Leia Segundo)
**Tempo**: ~45 minutos | **O que aprende**: Conceitos de C# necessários

Cobre os essenciais de C# que você precisa para programar o backend:
- Tipos de dados (int, string, decimal, etc)
- Classes e propriedades
- Async/Await (operações não-bloqueantes)
- LINQ (consultas elegantes)
- Entity Framework (acesso ao banco)
- Dependency Injection (arquitetura limpa)

**Por que importante**: O backend inteiro é escrito em C#. Sem entender isso, fica difícil ver como tudo funciona.

---

### 3️⃣ APRENDER_ANGULAR.md (Leia Terceiro)
**Tempo**: ~45 minutos | **O que aprende**: Conceitos de Angular necessários

Cobre os essenciais de Angular para o frontend:
- Componentes e Templates
- Data Binding (comunicação entre classe e HTML)
- Services (reutilizar código)
- Observables (fluxo de dados)
- Routing (navegação entre páginas)
- Forms (formulários com validação)
- HTTP (requisições para a API)

**Por que importante**: O frontend inteiro é em Angular. É como o usuário interage com o sistema.

---

### 4️⃣ QUICK_REFERENCE.md (Use Constantemente!)
**Tempo**: Consulta rápida | **O que é**: Snippets prontos para copiar

Não é para ler do início ao fim. Use quando precisar:
- "Como fazer um Controller em C#?" → Veja a seção C#
- "Como fazer um Service em Angular?" → Veja a seção Angular
- "Qual comando Git para push?" → Veja a seção Git

**Valor**: Economiza tempo na hora de codificar.

---

## 🗓️ Plano de Estudo Recomendado

### Dia 1: Fundamentos (2-3 horas)
1. Ler **ENTENDER_ARQUITETURA.md** completamente
2. Desenhar em um papel e tentar explicar:
   - Como funciona: Cliente (Browser) → Angular → API .NET → BD
   - Qual é o job de cada camada

### Dia 2: Backend (2-3 horas)
1. Ler **APRENDER_CSHARP.md** completamente
2. Abrir o código do projeto:
   - `backend/EnergyHub.API/Controllers/ClientesController.cs`
   - `backend/EnergyHub.API/Services/ClienteService.cs`
   - `backend/EnergyHub.API/Repositories/ClienteRepository.cs`
3. Encontrar no código:
   - ✅ Um exemplo de async/await
   - ✅ Um exemplo de LINQ
   - ✅ Um exemplo de Dependency Injection

### Dia 3: Frontend (2-3 horas)
1. Ler **APRENDER_ANGULAR.md** completamente
2. Abrir o código do projeto:
   - `frontend/energy-hub-ui/src/app/services/api.service.ts`
   - `frontend/energy-hub-ui/src/app/pages/clientes/clientes.page.ts`
3. Encontrar no código:
   - ✅ Um exemplo de Observable
   - ✅ Um exemplo de Component com Template
   - ✅ Um exemplo de Form

### Dia 4: Consolidar (1-2 horas)
1. Você entende como:
   - ✅ Dados chegam do BD em C# (Entity Framework)
   - ✅ Controller retorna como JSON
   - ✅ Angular recebe e mostra ao usuário
   - ✅ Usuário clica botão e Angular envia dados
   - ✅ Backend recebe, valida, salva

2. Praticar:
   - Tentar adicionar um novo campo `Email` a Cliente
   - Ter que mexer em: BD → Entity → DTO → Service → Controller → Angular Page

---

## 💡 Conceitos-Chave que Você Precisa Entender

### JavaScript vs TypeScript
```typescript
// JavaScript (dinâmico, sem tipo)
let idade = 25;
let nome = "João";
// typeof verifica em tempo de execução

// TypeScript (estático, com tipo)
let idade: number = 25;
let nome: string = "João";
// Erro em tempo de desenvolvimento!
```

### Síncrono vs Assíncrono
```csharp
// ❌ Sincrono - bloqueia
public ClienteDto GetCliente(int id)
{
    // A thread fica PRESA esperando BD responder
    var cliente = _context.Clientes.FirstOrDefault(x => x.Id == id);
    return mapper.Map<ClienteDto>(cliente);
}

// ✅ Assíncrono - não bloqueia
public async Task<ClienteDto> GetClienteAsync(int id)
{
    // A thread fica LIVRE para processar outra requisição!
    var cliente = await _context.Clientes
        .FirstOrDefaultAsync(x => x.Id == id);
    return mapper.Map<ClienteDto>(cliente);
}
```

### Observable vs Promise
```typescript
// Promise (resolve uma vez)
function getCliente(id: number): Promise<Cliente> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve({ id, nome: "Empresa A" }), 1000);
    });
}

// Observable (fluxo de dados)
function getCliente$(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`/api/clientes/${id}`);
}
```

---

## 🎮 Exercíciosonde Praticar

### Nível 1: Ler e Entender
- [ ] Ler todos os 4 arquivos
- [ ] Entender o fluxo: Cliente → Angular → API → BD

### Nível 2: Explorar Código
- [ ] Abrir `ClientesController.cs` e entender cada linha
- [ ] Abrir `ClienteService.ts` (Angular) e entender cada linha
- [ ] Rastrear: Quando usuário clica "Carregar", por onde os dados passam?

### Nível 3: Pequenas Mudanças
- [ ] Adicionar campo `Telefone` a Cliente (BD → Backend → Frontend)
- [ ] Adicionar "Filtrar por Região" na Lista
- [ ] Adicionar validação "CNPJ não pode estar vazio"

### Nível 4: Novo Feature
- [ ] Criar página de Dashboard com gráfico de consumo por região
- [ ] Criar filtro avançado de clientes
- [ ] Adicionar exportar clientes em Excel

---

## 🔗 Fluxo Completo: Um Exemplo Real

### 1️⃣ Usuário clica "Criar Cliente" → Angular
```typescript
// cliente-form.component.ts
enviarFormulario() {
  this.clienteService.createCliente(this.formulario.value)
    .subscribe(resultado => console.log("Sucesso!", resultado));
}
```

### 2️⃣ Angular faz HTTP POST
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

### 3️⃣ Backend recebe em C# Controller
```csharp
[HttpPost]
public async Task<IActionResult> CreateCliente(CreateClienteDto dto)
{
    var resultado = await _service.CreateClienteAsync(dto);
    return CreatedAtAction(nameof(GetCliente), new { id = resultado.Id }, resultado);
}
```

### 4️⃣ Service valida e processa
```csharp
public async Task<ClienteDto> CreateClienteAsync(CreateClienteDto dto)
{
    if (dto.ConsumoMedio <= 0)
        throw new InvalidOperationException("Consumo inválido");
    
    var cliente = new Cliente { ... };
    await _repository.AddAsync(cliente);
    return mapper.Map<ClienteDto>(cliente);
}
```

### 5️⃣ Repository salva no BD
```csharp
public async Task AddAsync(Cliente cliente)
{
    _context.Clientes.Add(cliente);
    await _context.SaveChangesAsync();
    // INSERT INTO Clientes ... ;
}
```

### 6️⃣ Resposta volta ao Angular
```json
201 Created
{
  "id": 5,
  "nome": "Empresa XYZ",
  "cnpj": "12.345.678/0001-90",
  "consumoMedio": 150.5,
  "regiao": "Sudeste"
}
```

### 7️⃣ Angular atualiza a tela
```typescript
.subscribe(novoCliente => {
    this.clientes.push(novoCliente);
    this.tabela.atualizar();
});
```

---

## 🚀 Próximos Passos Após Dominar os Fundamentos

1. **Debugging**: Use breakpoints no VS Code para rastrear código
2. **Testing**: Escreva testes unitários para Services
3. **Performance**: Use Network tab para ver requisições HTTP
4. **Segurança**: Adicione autenticação com JWT
5. **Deployment**: Deploy backend no Azure, frontend no Netlify

---

## 📞 Quando Ficar Preso

| Problema | Solução |
|----------|---------|
| "Não entendo async/await" | Releia a seção em APRENDER_CSHARP.md e veja exemplos |
| "Observable é confuso" | Releia a seção em APRENDER_ANGULAR.md |
| "Não sei por onde começar um feature" | Releia ENTENDER_ARQUITETURA.md |
| "Preciso de um exemplo de código" | Procure em QUICK_REFERENCE.md |
| "Erro 404 na API" | Verifique se Backend está rodando: `dotnet run` |
| "Erro CORS" | Vérifique se `appsettings.json` tem `http://localhost:4200` |

---

## ✅ Checklist Final

Quando você conseguir marcar TODAS estas coisas, você está pronto:

- [ ] Sei explicar a arquitetura em 3 camadas
- [ ] Entendo async/await e por que é importante
- [ ] Sei a diferença entre Observable e Promise
- [ ] Consigo ler um Controller e entender o que faz
- [ ] Consigo ler um Service (tanto C# quanto Angular) e entender
- [ ] Sei como um dado viaja: Angular → API → BD → API → Angular
- [ ] Consegui rodar o projeto (Backend + Frontend)
- [ ] Consegui fazer uma pequena mudança no código sem quebrar nada

Se chegou aqui, **parabéns! Você entende energicamente o projeto!** 🎉

---

## 📖 Ordem de Leitura Recomendada

```
1. COMECE_AQUI.md (você está aqui!)
   ↓
2. ENTENDER_ARQUITETURA.md (arquitetura geral)
   ↓
3. APRENDER_CSHARP.md (backend: C# / .NET)
   ↓
4. APRENDER_ANGULAR.md (frontend: Angular)
   ↓
5. QUICK_REFERENCE.md (consultarconforme precisa)
   ↓
6. Explorar código real do projeto
   ↓
7. Fazer pequenas mudanças/features
```

**Bom estudos! Você vai arrasar no estágio! 💪**
