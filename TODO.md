# Task: Fix Dashboard Frontend Errors + Consumo Functionality

Status: In progress - Step 1/8 complete (TODO created)

## Steps:

1. ✅ Create TODO.md - Tracking progress

2. 🛠️ Fix dashboard.page.ts 
   - Remove duplicate imports/@Component/template/class definition 
   - Convert selectedClienteId to proper signal
   - Clean template (remove internal duplication)
   - Add dashboard error signal for better UX
   - Verify `ng serve` compiles (eliminates TS2300, TS1146)

3. 🔍 Test compilation 
   - `cd frontend/energy-hub-ui && ng serve` - should compile without errors

4. 🚀 Test runtime
   - Backend running? `cd backend/EnergyHub.API && dotnet run` 
   - Open localhost:4200/dashboard
   - Check F12 Console/Network: /api/dashboard data has consumo fields?

5. 📊 Verify Consumo data display
   - Metrics show values or 0/NaN?
   - topClientesEconomia shows consumoMedioMensal etc.

6. ⚠️ Minor fixes
   - clientes.page.ts NG8107 warning
   - Any other console errors

7. ✅ Full test
   - Add consumo via /consumos page
   - Refresh dashboard → verify updates

8. 🎉 Complete task
