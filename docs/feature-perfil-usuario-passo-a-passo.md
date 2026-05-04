# 🎯 Feature: Perfil do Usuário - Passo a Passo Completo

## 📋 Visão Geral
Criar uma nova página de perfil de usuário acessível através do ícone de avatar (👤) no menu de navegação, onde o usuário pode ver e editar suas informações de cadastro, email, senha e outras configurações.

---

## 🗺️ Estrutura Atual Analisada

### ✅ O que já existe:
- **NavComponent** (`src/app/components/nav/navav.component.ts`) - Menu com avatar placeholder
- **AuthService** - Gerencia autenticação
- **AuthGuard** - Protege rotas
- **Rota `/dashboard`** - Página principal
- **Estrutura Angular** - Standalone components, signals, routing

### 🎯 Onde está o avatar:
No `NavComponent` (linha 77-83):
```typescript
<button
  type="button"
  class="group grid h-9 w-9 place-items-center rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/60 ring-1 ring-white/5 transition-all duration-300 hover:shadow-[0_18px_60px_-40px_rgba(148,163,184,0.25)]"
  aria-label="Usuário"
>
  <span class="text-sm font-semibold text-slate-200">👤</span>
</button>
```

---

## 🚀 Plano Passo a Passo

### **ETAPA 1: Backend - Criar Endpoints de Usuário**
1. **Criar DTOs de usuário**
   - `UsuarioDto` - Para visualização
   - `UpdateUsuarioDto` - Para atualização
   - `ChangePasswordDto` - Para troca de senha

2. **Criar/Atualizar Services**
   - `UsuarioService` - Lógica de negócio
   - Métodos: `GetByIdAsync`, `UpdateAsync`, `ChangePasswordAsync`

3. **Criar/Atualizar Controllers**
   - `UsuariosController` - Endpoints REST
   - `GET /api/usuarios/perfil` - Dados do usuário logado
   - `PUT /api/usuarios/perfil` - Atualizar dados
   - `POST /api/usuarios/trocar-senha` - Alterar senha

4. **Atualizar Repositories (se necessário)**
   - `IUsuarioRepository` e `UsuarioRepository`
   - Métodos para buscar e atualizar usuário

---

### **ETAPA 2: Frontend - Models e Services**
1. **Criar Models**
   - `src/app/models/usuario.model.ts`
   - `Usuario`, `UpdateUsuario`, `ChangePassword`

2. **Atualizar ApiService**
   - Adicionar métodos: `getUsuarioPerfil()`, `updateUsuario()`, `changePassword()`

3. **Criar Service de Perfil (opcional)**
   - `src/app/services/perfil.service.ts`
   - Lógica específica do perfil

---

### **ETAPA 3: Frontend - Página de Perfil**
1. **Criar Componente**
   - `src/app/pages/perfil/perfil.page.ts`
   - Standalone component com signals

2. **Estrutura da Página**
   - Header com informações básicas
   - Formulário de edição de dados
   - Seção de troca de senha
   - Botões de salvar/cancelar

3. **Funcionalidades**
   - Carregar dados do usuário
   - Validação de formulários
   - Feedback visual (loading, success, error)
   - Navegação automática após salvar

---

### **ETAPA 4: Frontend - Routing e Navegação**
1. **Adicionar Rota**
   - No `app.routes.ts`: `{ path: 'perfil', canActivate: [AuthGuard], loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage) }`

2. **Atualizar NavComponent**
   - Adicionar `routerLink="/perfil"` no botão do avatar
   - Melhorar visual do avatar com iniciais do usuário

3. **Proteger Rota**
   - Garantir que `AuthGuard` funcione corretamente

---

### **ETAPA 5: Melhorias e UX**
1. **Avatar Personalizado**
   - Mostrar iniciais do nome do usuário
   - Cores dinâmicas baseadas no nome

2. **Feedback Visual**
   - Toasts de sucesso/erro
   - Loading states
   - Animações suaves

3. **Validações**
   - Validação de email
   - Confirmação de senha
   - Senha atual obrigatória para mudanças

---

## 📁 Arquivos a Criar/Modificar

### **Backend**
```
backend/EnergyHub.API/
├── DTOs/
│   ├── UsuarioDto.cs (NOVO)
│   ├── UpdateUsuarioDto.cs (NOVO)
│   └── ChangePasswordDto.cs (NOVO)
├── Services/
│   └── UsuarioService.cs (NOVO ou ATUALIZAR)
├── Controllers/
│   └── UsuariosController.cs (NOVO)
└── Repositories/
    ├── IUsuarioRepository.cs (ATUALIZAR)
    └── UsuarioRepository.cs (ATUALIZAR)
```

### **Frontend**
```
frontend/energy-hub-ui/src/app/
├── models/
│   └── usuario.model.ts (NOVO)
├── services/
│   ├── api.service.ts (ATUALIZAR)
│   └── perfil.service.ts (OPCIONAL)
├── pages/
│   └── perfil/
│       ├── perfil.page.ts (NOVO)
│       └── perfil.page.css (OPCIONAL)
├── app.routes.ts (ATUALIZAR)
└── components/
    └── nav/
        └── nav.component.ts (ATUALIZAR)
```

---

## 🎨 Design da Interface

### **Layout da Página de Perfil**
```html
<div class="perfil-container">
  <!-- Header com avatar e nome -->
  <div class="perfil-header">
    <div class="avatar-grande">👤</div>
    <div class="info-basicas">
      <h1>Nome do Usuário</h1>
      <p>email@exemplo.com</p>
    </div>
  </div>

  <!-- Formulário de dados -->
  <div class="formulario-section">
    <h2>Dados Pessoais</h2>
    <form>
      <input placeholder="Nome" />
      <input placeholder="Email" />
      <button type="submit">Salvar Dados</button>
    </form>
  </div>

  <!-- Formulário de senha -->
  <div class="senha-section">
    <h2>Alterar Senha</h2>
    <form>
      <input type="password" placeholder="Senha Atual" />
      <input type="password" placeholder="Nova Senha" />
      <input type="password" placeholder="Confirmar Nova Senha" />
      <button type="submit">Alterar Senha</button>
    </form>
  </div>
</div>
```

### **Estilos (TailwindCSS)**
- Usar classes consistentes com o resto do app
- Cards com `eh-card`
- Botões com gradientes do sistema
- Formulários com `bg-slate-950/40 border border-slate-800/70`

---

## 🔧 Detalhes Técnicos

### **Backend - DTOs**
```csharp
// UsuarioDto.cs
public class UsuarioDto
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// ChangePasswordDto.cs
public class ChangePasswordDto
{
    public string SenhaAtual { get; set; }
    public string NovaSenha { get; set; }
    public string ConfirmarNovaSenha { get; set; }
}
```

### **Frontend - Models**
```typescript
// usuario.model.ts
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUsuario {
  nome: string;
  email: string;
}

export interface ChangePassword {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}
```

### **Frontend - ApiService**
```typescript
// api.service.ts (métodos novos)
getUsuarioPerfil(): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apiUrl}/usuarios/perfil`);
}

updateUsuario(data: UpdateUsuario): Observable<Usuario> {
  return this.http.put<Usuario>(`${this.apiUrl}/usuarios/perfil`, data);
}

changePassword(data: ChangePassword): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/usuarios/trocar-senha`, data);
}
```

---

## 🧪 Testes e Validação

### **Backend**
- ✅ Validação de email único
- ✅ Senha atual obrigatória para mudança
- ✅ Confirmação de senha bate com nova senha
- ✅ Usuário só pode editar próprio perfil

### **Frontend**
- ✅ Validação de formulários
- ✅ Loading states
- ✅ Error handling
- ✅ Feedback visual de sucesso

---

## 🚀 Implementação - Ordem Sugerida

1. **Primeiro**: Backend endpoints básicos
2. **Segundo**: Frontend models e service
3. **Terceiro**: Página de perfil estática
4. **Quarto**: Integração com API
5. **Quinto**: Melhorias de UX e validações
6. **Sexto**: Testes e ajustes finais

---

## 🎯 Benefícios

✅ **Experiência do usuário** - Acesso fácil ao perfil  
✅ **Segurança** - Troca de senha segura  
✅ **Manutenibilidade** - Código organizado e reutilizável  
✅ **Escalabilidade** - Base para futuras features de usuário  
✅ **Consistência** - Segue padrões do projeto  

---

## ⚡ Dicas Importantes

- **Reutilizar estilos**: Manter consistência visual com o dashboard
- **Signals Angular**: Usar signals para estado reativo
- **Error handling**: Tratar erros de forma amigável
- **Loading states**: Mostrar carregamento durante requisições
- **Validação client-side**: Validar antes de enviar para o backend
- **Toast notifications**: Feedback visual de ações

---

## 🎉 Resultado Esperado

Ao final, o usuário poderá:
1. Clicar no avatar 👤 no menu
2. Ser redirecionado para `/perfil`
3. Ver suas informações de cadastro
4. Editar nome e email
5. Alterar senha com segurança
6. Receber feedback de todas as ações

**Pronto para começar a implementação! 🚀**
