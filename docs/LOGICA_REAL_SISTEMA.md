# 🧠 Energy Hub - A Lógica Real do Mercado Livre de Energia

## 🎯 O que é o Sistema?

O Energy Hub simula o **Mercado Livre de Energia** brasileiro. É um sistema onde:

- **👥 Clientes (Empresas)**: Consomem energia
- **📜 Contratos**: Definem quanto cada cliente paga
- **💱 Mercado**: Define um preço de referência diferente
- **💰 Economia**: A diferença entre o que o cliente paga vs. o que pagaria no mercado

---

## 🔑 Conceitos Principais

### 1️⃣ Cliente
```csharp
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Cnpj { get; set; }
    public decimal ConsumoMedio { get; set; }  // MWh/mês
    public string Regiao { get; set; }
    public List<Contrato> Contratos { get; set; }  // Pode ter múltiplos!
}
```

**Importante:** Um cliente pode ter:
- ❌ Nenhum contrato
- ✅ Um contrato ativo (hoje está negociando com alguém)
- ⚠️ Vários contratos em diferentes períodos

### 2️⃣ Contrato
```csharp
public class Contrato
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public decimal PrecoMwh { get; set; }      // O que negocia pagar
    public string Fornecedor { get; set; }     // De quem está comprando
    public DateOnly DataInicio { get; set; }   // Quando começa
    public DateOnly DataFim { get; set; }      // Quando termina
}
```

**Regra de Atividade:**
```
⏰ Hoje = DataAtual

SE: Hoje < DataInicio  →  🟡 FUTURO
SE: Hoje >= DataInicio E Hoje <= DataFim  →  🟢 ATIVO
SE: Hoje > DataFim  →  🔴 EXPIRADO
```

### 3️⃣ Economia = Diferença
```
Preço de Referência (Mercado): 500 R$/MWh

Cliente A:
  - Contrato com Fornecedor X: 250 R$/MWh
  - Consumo: 500 MWh/mês
  - Economia Mensal = (500 - 250) × 500 = 125.000 R$/mês
```

---

## 🚀 Novas Funcionalidades Implementadas

### 1️⃣ Status do Contrato (Enum)
```csharp
public enum ContratoStatus
{
    Futuro = 0,    // 🟡 Ainda não começou
    Ativo = 1,     // 🟢 Está valendo agora
    Expirado = 2   // 🔴 Já expirou
}
```

**Helper para calcular:**
```csharp
ContratoStatus status = ContratoStatusHelper.GetStatus(dataInicio, dataFim);
// Retorna: Futuro, Ativo ou Expirado
```

### 2️⃣ ContratoDto com informações visuais
```json
{
  "id": 1,
  "clienteId": 5,
  "precoMwh": 250.50,
  "fornecedor": "Fornecedor X",
  "dataInicio": "2025-01-15",
  "dataFim": "2026-01-15",
  "status": 1,           // ← Novo: Enum do status
  "statusBadge": "🟢 Ativo"  // ← Novo: Visual bonito
}
```

### 3️⃣ ClienteDetailDto com Contrato Ativo
```json
{
  "id": 1,
  "nome": "Cliente A",
  "cnpj": "12.345.678/0001-00",
  "consumoMedio": 500,
  "regiao": "São Paulo",
  "contratoAtivo": {
    // ← Novo: O contrato ativo deste cliente (ou null)
    "id": 1,
    "precoMwh": 250.50,
    "fornecedor": "Fornecedor X",
    "dataInicio": "2025-01-15",
    "dataFim": "2026-01-15",
    "status": 1,
    "statusBadge": "🟢 Ativo"
  },
  "statusContrato": "✅ Contrato Ativo",     // ← Novo: Texto visual
  "economiaEstimada": 125000.00              // ← Novo: Economia total
}
```

### 4️⃣ Dashboard com Estatísticas
```json
{
  "totalContratos": 50,           // Total de contratos no sistema
  "totalContratosAtivos": 35,     // Apenas os que estão valendo
  "totalContratosExpirados": 12,  // Que já expiraram
  "totalContratosFuturos": 3,     // Que ainda não começaram
  "totalClientes": 20,            // Total de clientes
  "clientesComContratoAtivo": 15, // Que têm contrato ativo
  "economiaTotal": 1750000.00,    // Soma de todas as economias
  "economiaMensal": 145833.33,    // Economia por mês
  "topClientesEconomia": [        // Top 5 clientes
    {
      "clienteId": 1,
      "nomeCliente": "Cliente A",
      "economiaEstimada": 375000.00,
      "fornecedor": "Fornecedor X"
    }
  ]
}
```

### 5️⃣ Simulação de Economia
**API:** `POST /api/clientes/{id}/simular-economia?precoMercadoAtualMwh=X`

```
Entrada:
  - clienteId: 1
  - precoMercadoAtualMwh: 400.00

Lógica:
  1. Busca cliente
  2. Encontra seu contrato ativo
  3. Compara:
     - Preço contrato: 250.50 R$/MWh
     - Preço mercado: 400.00 R$/MWh
  4. Calcula economia: (400.00 - 250.50) × 500 = 74.750 R$/mês

Saída:
{
  "clienteId": 1,
  "consumoMwh": 500,
  "precoAtualMwh": 400.00,
  "economiaPercentual": 37.50,  // (74750 / 200000) × 100
  "economiaValor": 74750.00
}
```

---

## 📊 Exemplos de Casos de Uso

### Caso 1: Cliente SEM Contrato
```
Cliente: Empresa B
Contratos: []

→ statusContrato = "❌ Sem Contrato"
→ economiaEstimada = 0
→ No dashboard: Não aparece no TOP 5
```

### Caso 2: Cliente COM Contrato Ativo
```
Cliente: Empresa A
Contratos: [
  {
    fornecedor: "Fornecedor X",
    precoMwh: 250.50,
    dataInicio: 2025-01-15,
    dataFim: 2026-01-15  ← Ainda válido (hoje é 2025-04-14)
  }
]

→ contratoAtivo = {...}
→ status = "🟢 Ativo"
→ statusContrato = "✅ Contrato Ativo"
→ economiaEstimada = (500 - 250.50) × 500 = 124.750 R$/mês
```

### Caso 3: Cliente COM Contrato Expirado + Novo Futuro
```
Cliente: Empresa C
Contratos: [
  {
    fornecedor: "Fornecedor A",
    precoMwh: 300,
    dataInicio: 2024-01-01,
    dataFim: 2025-01-01  ← Já expirou
    status: 2  // 🔴 Expirado
  },
  {
    fornecedor: "Fornecedor B",
    precoMwh: 280,
    dataInicio: 2025-06-01,  ← Ainda não começou
    dataFim: 2026-06-01
    status: 0  // 🟡 Futuro
  }
]

→ contratoAtivo = null  (nenhum está valendo AGORA)
→ statusContrato = "❌ Sem Contrato"
→ economiaEstimada = 0 (pois não tem contrato ativo)
→ Dashboard mostra: "Contrato futuro aguardando ativação"
```

---

## 🔄 Fluxo da Lógica

```
┌─────────────────────────────────────────────────┐
│  ClienteService.GetAllWithDetailsAsync()        │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Para cada Cliente:                             │
│  1. Busca Contratos                             │
│  2. Filtra o PRIMEIRO com status = ATIVO        │
│  3. Calcula economia: (500 - precoMwh) × consumo│
│  4. Retorna ClienteDetailDto                    │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  Frontend recebe:                               │
│  ✅ Contrato ativo (ou null)                     │
│  ✅ Status visual ✅ 🟢 🔴 🟡                     │
│  ✅ Economia estimada                           │
│  ✅ Data início/fim do contrato                 │
└─────────────────────────────────────────────────┘
```

---

## 📝 Regras de Negócio Implementadas

### ✅ Contrato Ativo
- Um cliente pode ter **múltiplos contratos**, mas apenas **um ativo por vez**
- O ativo é o que tem: `Hoje >= DataInicio E Hoje <= DataFim`

### ✅ Economia Real
- **NÃO é inventada** - vem da diferença entre preços reais
- Só é calculada se houver **contrato ativo**
- Usa consumo do cliente × diferença de preços

### ✅ Status Visual
- 🟢 **Ativo**: Cliente está economizando AGORA
- 🔴 **Expirado**: Precise renovar ou encontrar novo fornecedor
- 🟡 **Futuro**: Aguardando início (cliente já negociou)
- ❌ **Sem Contrato**: Precisa negociar

### ✅ Dashboard
- Mostra **snapshot** do sistema em tempo real
- Economia total = soma rápida dos TOP 5
- Identifica clientes com melhor negocio

---

## 🎓 Próximos Passos (Sugestões)

### Frontend - Dashboard
```
┌─────────────────────────────────────┐
│ 📊 DASHBOARD ENERGY HUB             │
├─────────────────────────────────────┤
│ 🟢 Contratos Ativos: 35             │
│ 🔴 Expirados: 12                    │
│ 🟡 Futuros: 3                       │
│ 💰 Economia Total: R$ 1.750.000,00  │
│                                     │
│ 🏆 TOP 5 Economias:                 │
│ 1. Empresa A: R$ 375.000/mês        │
│ 2. Empresa B: R$ 280.500/mês        │
│ 3. ...                              │
└─────────────────────────────────────┘
```

### Frontend - Listagem de Clientes
```
┌──────────────┬──────────┬────────────┬──────────────┐
│ Cliente      │ Contrato │ Fornecedor │ Economia     │
├──────────────┼──────────┼────────────┼──────────────┤
│ Empresa A    │ 🟢 Ativo │ Fornec. X  │ R$ 125.000,00│
│ Empresa B    │ ❌ Sem   │ -          │ R$ 0,00      │
│ Empresa C    │ 🟡 Futuro│ Fornec. Y  │ Pendente     │
└──────────────┴──────────┴────────────┴──────────────┘
```

### Frontend - Detalhe do Cliente
```
👤 Empresa A
├─ CNPJ: 12.345.678/0001-00
├─ Consumo: 500 MWh/mês
├─ Região: São Paulo
└─ 📜 Contrato Ativo
    ├─ Fornecedor: Fornecedor X
    ├─ Preço: R$ 250,50/MWh
    ├─ Período: 15/01/2025 → 15/01/2026
    ├─ Status: 🟢 Ativo (vaildo por 276 dias)
    └─ Economia Estimada: R$ 125.000,00/mês
```
