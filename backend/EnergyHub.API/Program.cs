using EnergyHub.API.Data;
using EnergyHub.API.Repositories;
using EnergyHub.API.Services;
using EnergyHub.API.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "EnergyHub API", Version = "v1" });
});

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection") ?? "",
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection") ?? "")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Para evitar falhas por mismatch de config/claims em desenvolvimento.
            // Em produção, ajuste para true e garanta issuer/audience consistentes.
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? string.Empty,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? string.Empty,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Auth services
builder.Services.AddScoped<PasswordHasher>();
builder.Services.AddScoped<JwtTokenService>();

builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<IClienteService>(provider => provider.GetService<ClienteService>()!);
builder.Services.AddScoped<IContratoRepository, ContratoRepository>();
builder.Services.AddScoped<IContratoService, ContratoService>();
builder.Services.AddScoped<IConsumoRepository, ConsumoRepository>();
builder.Services.AddScoped<IConsumoService, ConsumoService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// CORS for Angular (localhost:4200)
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5243);
});

var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "EnergyHub API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("Development");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

