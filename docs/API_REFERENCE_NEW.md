# 🚀 Energy Hub - Nova API Reference

## 📊 Dashboard

### GET /api/dashboard
**Retorna estatísticas gerais do sistema, incluindo ranking de clientes por economia**

```json
{
  "totalContratos": 10,
  "totalContratosAtivos": 5,
  "totalContratosExpirados": 3,
  "totalContratosFuturos": 2,
  "totalClientes": 20,
  "clientesComContratoAtivo": 15,
  "economiaTotal": 45000.50,
  "economiaMensal": 3750.04,
  "topClientesEconomia": [
    {
      "clienteId": 1,
      "nomeCliente": "Cliente A",
      "economiaEstimada": 15000.00,
      "fornecedor": "Fornecedor X"
    }
  ]
}
```

---

## 👥 Clientes

### GET /api/clientes/com-detalhes
**Lista todos os clientes com informações de contrato ativo**

### GET /api/clientes/{id}/economia?precoAtual={preco}
**Calcula economia para cliente com contrato ativo usando preço fornecido**

**Parâmetros:**
- `precoAtual`: decimal (preço atual do mercado em R$/MWh)

**Resposta:**
```json
{
  "clienteId": 1,
  "consumoMwh": 500,
  "precoAtualMwh": 300,
  "economiaPercentual": 25.0,
  "economiaValor": 37500.0
}
```

### POST /api/clientes/{clienteId}/simular-economia?precoMercadoAtualMwh={preco}
**Simula economia usando contrato ativo do cliente**

**Parâmetros:**
- `precoMercadoAtualMwh`: decimal

**Resposta:** Mesmo formato do GET acima

---

## 👥 Clientes

### GET /api/clientes/com-detalhes
**Lista todos os clientes com informações de contrato ativo**

```json
[
  {
    "id": 1,
    "nome": "Cliente A",
    "cnpj": "12.345.678/0001-00",
    "consumoMedio": 500,
    "regiao": "São Paulo",
    "contratoAtivo": {
      "id": 1,
      "clienteId": 1,
      "precoMwh": 250.50,
      "fornecedor": "Fornecedor X",
      "dataInicio": "2025-01-15",
      "dataFim": "2026-01-15",
      "status": 1,  // 0=Futuro, 1=Ativo, 2=Expirado
      "statusBadge": "🟢 Ativo"
    },
    "statusContrato": "✅ Contrato Ativo",
    "economiaEstimada": 125000.00
  }
]
```

### GET /api/clientes/:id/detalhes
**Obtém detalhes de um cliente específico com contrato ativo**

Resposta: Mesmo formato acima, um objeto único

---

## 📝 Contratos

### GET /api/contratos
**Lista todos os contratos com status calculado**

```json
[
  {
    "id": 1,
    "clienteId": 1,
    "precoMwh": 250.50,
    "fornecedor": "Fornecedor X",
    "dataInicio": "2025-01-15",
    "dataFim": "2026-01-15",
    "status": 1,
    "statusBadge": "🟢 Ativo"
  }
]
```

### GET /api/contratos/cliente/:clienteId
**Lista contratos de um cliente**

---

## 💰 Simulação de Economia

### POST /api/clientes/:clienteId/simular-economia
**Simula economia comparando com preço do mercado atual**

**Query Parameter:**
- `precoMercadoAtualMwh` (decimal): Preço atual do MWh no mercado

**Exemplo:**
```
POST /api/clientes/1/simular-economia?precoMercadoAtualMwh=400.00
```

**Resposta:**
```json
{
  "clienteId": 1,
  "consumoMwh": 500,
  "precoAtualMwh": 400.00,
  "economiaPercentual": 25.06,
  "economiaValor": 74250.00
}
```

---

## 🎯 Casos de Uso

### 1️⃣ Mostrar Dashboard Principal
```
GET /api/dashboard
```
- Total de contratos por status
- Economia total estimada
- TOP 5 clientes com maior economia

### 2️⃣ Listar Clientes com Status de Contrato
```
GET /api/clientes/com-detalhes
```
- Mostra coluna "Contrato: ✅ Ativo" ou "❌ Sem contrato"
- Economia estimada por cliente

### 3️⃣ Detalhe de Cliente
```
GET /api/clientes/:id/detalhes
```
- Informações do contrato ativo
- Data de início e fim
- Preço negociado (precoMwh)
- Fornecedor

### 4️⃣ Simular Economia
```
POST /api/clientes/:clienteId/simular-economia?precoMercadoAtualMwh=X
```
- Compara preço do contrato
- Com preço atual do mercado
- Retorna economia em valor e percentual

---

## 📌 Status do Contrato

| Status | Valor | Significado |
|--------|-------|-------------|
| Futuro | 0 | Data de início ainda não começou |
| Ativo | 1 | Entre data de início e fim |
| Expirado | 2 | Data de fim já passou |

---

## 🔑 Principais Mudanças

✅ **ContratoDto** agora inclui:
- `Status` (enum)
- `StatusBadge` (visual 🟢 🔴 🟡)

✅ **ClienteDetailDto** agora inclui:
- `ContratoAtivo` (objeto completo)
- `StatusContrato` (texto visual)
- `EconomiaEstimada` (decimal)

✅ **Novos Endpoints:**
- Dashboard com estatísticas
- Clientes com detalhes de contrato
- Simulação de economia baseada em contrato

✅ **Nova Lógica:**
- Status automático (Ativo/Expirado/Futuro) baseado em datas
- Economia corretamente calculada com preço do contrato
- Identificação de contrato ativo por cliente
