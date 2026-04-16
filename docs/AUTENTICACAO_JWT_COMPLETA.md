# 📋 Autenticação JWT - Guia Completo do EnergyHub

## 🎯 O que é JWT (JSON Web Token)?

JWT é um padrão aberto (RFC 7519) que define uma forma compacta e autossuficiente de transmitir informações entre partes como um objeto JSON. É como um "crachá digital" que prova quem você é e o que pode fazer.

### 🔄 Como funciona no EnergyHub:

```
Usuário faz login → Backend gera JWT → Frontend armazena token → 
Frontend envia token em requisições → Backend valida token → Retorna dados
```

---

## 🏗️ Arquitetura Completa da Autenticação

### 1️⃣ Backend - Geração do Token

#### 🔐 PasswordHasher (Services/Auth/PasswordHasher.cs)
```csharp
// Cria hash seguro da senha do usuário
public string HashPassword(string password)
{
    using var hmac = new HMACSHA512();
    salt = hmac.Key;
    hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(hash);
}

// Verifica se a senha está correta
public bool VerifyPassword(string password, string storedHash, string storedSalt)
{
    using var hmac = new HMACSHA512(Convert.FromBase64String(storedSalt));
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    return computedHash.SequenceEqual(Convert.FromBase64String(storedHash));
}
```

#### 🎫 JwtTokenService (Services/Auth/JwtTokenService.cs)
```csharp
// Gera token JWT com informações do usuário
public string GenerateToken(Usuario user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // ID do usuário
        new Claim(ClaimTypes.Name, user.Nome),
        new Claim(ClaimTypes.Email, user.Email)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(24), // Token válido por 24 horas
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

### 2️⃣ Backend - Validação do Token

#### 🛡️ Configuração no Program.cs
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false, // Em desenvolvimento, não valida issuer
            ValidateAudience = false, // Em desenvolvimento, não valida audience
            ValidateLifetime = true, // Valida expiração do token
            ValidateIssuerSigningKey = true, // Valida assinatura do token
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
```

#### 🔍 Extração do ID do Usuário nos Controllers
```csharp
// Método helper em todos os controllers
private int GetUserId()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (string.IsNullOrEmpty(userIdClaim))
        throw new UnauthorizedAccessException("Token inválido");
    
    return int.Parse(userIdClaim);
}
```

### 3️⃣ Frontend - Armazenamento e Uso do Token

#### 💾 AuthService (frontend/src/app/services/auth.service.ts)
```typescript
// Armazena token no localStorage
setToken(token: string): void {
  localStorage.setItem('energyhub_token', token);
}

// Recupera token
getToken(): string | null {
  return localStorage.getItem('energyhub_token');
}

// Remove token (logout)
logout(): void {
  localStorage.removeItem('energyhub_token');
}

// Verifica se está autenticado
isAuthenticated(): boolean {
  const token = this.getToken();
  if (!token) return false;

  const exp = this.getTokenExp(token);
  return exp > Math.floor(Date.now() / 1000);
}
```

#### 🚀 Interceptor para Incluir Token em Requisições
```typescript
// Adiciona automaticamente o token em todas as requisições HTTP
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next.handle(req);
}
```

---

## 📊 Fluxo Completo de Autenticação

### 🔑 Login
1. **Frontend**: Usuário insere email e senha
2. **Frontend**: Envia POST para `/api/auth/login`
3. **Backend**: AuthController recebe dados
4. **Backend**: Verifica se usuário existe no banco
5. **Backend**: Usa PasswordHasher para comparar senhas
6. **Backend**: Se senha correta, gera JWT com JwtTokenService
7. **Backend**: Retorna token para frontend
8. **Frontend**: AuthService armazena token no localStorage
9. **Frontend**: Redireciona para dashboard

### 📝 Registro
1. **Frontend**: Usuário preenche formulário de registro
2. **Frontend**: Envia POST para `/api/auth/register`
3. **Backend**: AuthController recebe dados
4. **Backend**: Verifica se email já existe
5. **Backend**: Usa PasswordHasher para criar hash da senha
6. **Backend**: Salva usuário no banco com hash e salt
7. **Backend**: Gera JWT automaticamente
8. **Backend**: Retorna token para frontend
9. **Frontend**: AuthService armazena token e redireciona

### 🚪 Logout
1. **Frontend**: Usuário clica em "Sair"
2. **Frontend**: AuthService.removeToken() limpa localStorage
3. **Frontend**: Redireciona para página de login
4. **Backend**: Token expira naturalmente após 24 horas

---

## 🔐 Segurança Implementada

### ✅ O que fazemos seguro:
- **Senhas nunca armazenadas em texto claro** - sempre com hash + salt
- **Tokens com expiração** - 24 horas de validade
- **Assinatura HMAC-SHA256** - impede falsificação
- **HTTPS em produção** - criptografa comunicação
- **CORS configurado** - permite apenas frontend específico

### 🛡️ Proteções contra:
- **SQL Injection** - Entity Framework parameteriza queries
- **XSS** - Angular sanitiza automaticamente
- **CSRF** - Tokens JWT são imunes a CSRF
- **Password Dictionary Attacks** - Salt único por usuário

---

## 📂 Estrutura de Arquivos da Autenticação

### Backend (EnergyHub.API/)
```
├── Controllers/
│   └── AuthController.cs          # Endpoints de login/register
├── Services/
│   ├── Auth/
│   │   ├── PasswordHasher.cs     # Hash/verificação de senhas
│   │   └── JwtTokenService.cs    # Geração de tokens JWT
│   └── AuthService.cs           # Serviço principal de autenticação
├── Entities/
│   └── Usuario.cs               # Modelo de dados do usuário
├── Data/
│   └── ApplicationDbContext.cs # Contexto do Entity Framework
└── Program.cs                   # Configuração de JWT e CORS
```

### Frontend (energy-hub-ui/src/app/)
```
├── services/
│   └── auth.service.ts          # Gerenciamento de token
├── interceptors/
│   └── auth.interceptor.ts      # Inclui token em requisições
├── guards/
│   └── auth.guard.ts           # Protege rotas
└── components/
    └── nav/nav.component.ts     # Botão de login/logout
```

---

## 🚀 Como Usar no Dia a Dia

### Para fazer login:
```typescript
this.authService.login('email@exemplo.com', 'senha123').subscribe({
  next: (response) => {
    // Token salvo automaticamente
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    console.error('Login falhou:', err);
  }
});
```

### Para verificar se está logado:
```typescript
if (this.authService.isAuthenticated()) {
  // Usuário está autenticado
  this.router.navigate(['/dashboard']);
} else {
  // Redirecionar para login
  this.router.navigate(['/login']);
}
```

### Para fazer logout:
```typescript
onLogout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
```

---

## 🔧 Configuração Necessária

### appsettings.json (Backend)
```json
{
  "Jwt": {
    "Key": "sua-chave-secreta-super-long-aqui-minimo-32-bytes",
    "Issuer": "EnergyHub",
    "Audience": "EnergyHubUsers"
  },
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;database=energyhub;user=root;password=sua-senha"
  }
}
```

### environment.ts (Frontend)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5243/api'
};
```

---

## 🎯 Resumo da Implementação

1. **Backend gera tokens JWT seguros** com informações do usuário
2. **Frontend armazena tokens** no localStorage
3. **Interceptor inclui token** em todas as requisições
4. **Controllers extraem ID do usuário** do token para filtrar dados
5. **Logout limpa token** e redireciona para login
6. **Toda comunicação é segura** com HTTPS e validação

**Resultado final:** Sistema completo onde cada usuário vê apenas seus próprios dados, com autenticação segura e experiência fluida! 🎉
