# EnergyHub TODO - Progress Tracking

## Phase 1: Backend Setup & Clients (Level 1) ✅ Started
- [x] 1. Add EF Core + MySQL deps to `.csproj` + restore.
- [x] 2. Create Entities: `Cliente`, `Contrato`, `Consumo`.
- [x] 3. Create DTOs: `CreateClienteDto`, `ClienteDto`, `CreateContratoDto`, `ContratoDto`, `EconomiaSimulacaoDto`.
  - [x] 4. Setup `Data/ApplicationDbContext` with EF config.
  - [x] 5. Update `Program.cs`: Add DbContext, CORS, controllers, Swagger auth.
  - [x] 6. Add MySQL connection to `appsettings.json`.
- [x] 7. Create `Controllers/ClientesController` (CRUD).
- [x] 8. Create `Services/ClienteService`, `Repositories/ClienteRepository`.
- [x] 9. Implement economy calc logic in service.
- [x] 10. EF migrations: Created (MySQL setup pending).

## Phase 2: Backend Contracts (Level 2) ✅ Complete
- [x] 11. `Controllers/ContratosController` (CRUD + link to client).
- [x] 12. `Services/ContratoService`, `Repositories/ContratoRepository`.

## Phase 3: Frontend (Levels 3-4)
- [ ] 13. Angular: Add deps (HttpClient, forms).
- [ ] 14. Models: `Cliente`, `Contrato`, `Consumo`.
- [ ] 15. Services: `ClienteService`, `ContratoService` (API calls).
- [ ] 16. Pages/Components: Clients list/form, Contracts form, Dashboard, Simulation.
- [ ] 17. Update routes, nav.
- [ ] 18. Tailwind styles for energy theme.

## Phase 4: Polish
- [ ] 19. Economy dashboard charts (Chart.js).
- [ ] 20. Basic auth prep (JWT).
- [ ] 21. Tests/endpoints validation.

**Next: Execute Phase 1 steps iteratively. Run `dotnet run` after backend basics. Update checklist as completed.**

