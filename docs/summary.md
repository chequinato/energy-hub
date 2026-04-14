⚡ 💡 EnergyHub — visão geral

👉 Sistema pra gestão de clientes no mercado livre de energia

Simula o que um banco faria:

cadastro de clientes
contratos de energia
cálculo de economia
dashboard com métricas reais e ranking de clientes

🧱 🧠 Arquitetura (simples e profissional)

Vamos usar arquitetura em camadas:

Controller → Service → Repository → Database

👉 fluxo:

Controller → recebe requisição HTTP
Service → regra de negócio
Repository → acesso ao banco
Database → MySQL

🗂️ Estrutura do projeto (completa)
energy-hub/
 ├── backend/
 │    └── EnergyHub.API/
 │         ├── Controllers/
 │         │    ├── DashboardController.cs (métricas e ranking)
 │         │    ├── ClientesController.cs (com simulação de economia)
 │         │    └── ContratosController.cs
 │         ├── Services/
 │         │    ├── DashboardService.cs (cálculo de economia total e ranking)
 │         │    ├── ClienteService.cs (simulação de economia com contratos)
 │         │    └── ContratoService.cs
 │         ├── Repositories/
 │         │    ├── ClienteRepository.cs (carregamento de contratos)
 │         │    └── ContratoRepository.cs
 │         ├── Entities/
 │         │    ├── Cliente.cs
 │         │    ├── Contrato.cs
 │         │    └── Consumo.cs
 │         ├── DTOs/
 │         │    ├── DashboardDto.cs (métricas e top clientes)
 │         │    ├── ClienteDetailDto.cs
 │         │    └── EconomiaSimulacaoDto.cs
 │         ├── Data/
 │         │    └── ApplicationDbContext.cs
 │         ├── Program.cs
 │         └── appsettings.json
 │
 ├── frontend/
 │    └── energy-hub-ui/
 │         ├── src/
 │         │    ├── app/
 │         │    │    ├── components/
 │         │    │    ├── pages/
 │         │    │    │    ├── dashboard/ (conectado ao backend)
 │         │    │    │    ├── clientes/
 │         │    │    │    └── contratos/
 │         │    │    ├── services/
 │         │    │    │    └── api.service.ts (HTTP client)
 │         │    │    └── models/
 │         │    │         ├── dashboard.model.ts
 │         │    │         ├── cliente-detail.model.ts
 │         │    │         └── economia.model.ts
 │
 ├── infra/
 │    └── (Terraform depois)
 │
 ├── docs/
 └── README.md

🧠 Backend (.NET 8)
🔹 Controllers

Responsável por receber requisições:

Ex:

ClienteController

🔹 Services

Regra de negócio:

Ex:

calcular economia
validar dados

🔹 Repositories

Fala com o banco:

Ex:

salvar cliente
buscar dados

🔹 Entities

Representação do banco:

Ex:

Cliente
Contrato
Consumo

🔹 DTOs

Objetos de entrada/saída da API

👉 evita expor entidade direto (isso é nível empresa)

🔹 Data
DbContext
configuração do banco
🎨 Frontend (Angular)
📁 Estrutura
app/
 ├── components/
 ├── pages/
 ├── services/
 └── models/

🔹 Pages
tela de clientes
tela de contratos
dashboard

🔹 Services

👉 fazem chamadas pra API

🔹 Models

👉 representam dados (igual DTO)

☁️ Infraestrutura (Terraform depois)

Com Terraform tu vai subir:

EC2 → backend
S3 → frontend
RDS → MySQL
VPC → rede
🧠 Banco de dados (MySQL)
Cliente
Id
Nome
Cnpj
ConsumoMedio
Regiao
Contrato
Id
ClienteId
PrecoMwh
Fornecedor
DataInicio
DataFim
Consumo
Id
ClienteId
Mes
ConsumoMwh

🔥 Funcionalidades (MVP)
1. Clientes
cadastrar
listar
editar
deletar
2. Contratos
cadastrar contrato
vincular cliente
3. Simulação de economia (🔥 destaque)
calcula custo atual vs mercado livre
mostra economia %
4. Dashboard
consumo
economia
contratos
🧠 Regras de negócio (importante)

Exemplo:

Se consumo > X → elegível mercado livre
Calcular economia = (preço antigo - preço contrato) * consumo
🔐 Autenticação (futuro)
login JWT
roles (admin / analista)
🚀 Evolução do projeto
Nível 1
CRUD cliente
Nível 2
contratos
Nível 3
cálculo de economia
Nível 4
dashboard Angular
Nível 5
Terraform + AWS
🧠 Como isso te posiciona

Se tu fizer isso direito:

👉 já tá MUITO acima de estagiário comum
👉 parece dev júnior pronto

📌 Resumo seco
arquitetura em camadas
backend .NET
frontend Angular
banco MySQL
infra Terraform