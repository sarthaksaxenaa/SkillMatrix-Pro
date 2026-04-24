Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Starting SkillMatrix-Pro Services   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BasePath = Get-Location

# Start AI Engine
Write-Host "[1/3] Starting FastAPI AI Engine (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$host.ui.RawUI.WindowTitle='SkillMatrix - AI Engine'; python main.py" -WorkingDirectory "$BasePath\ai-engine"

# Start Backend
Write-Host "[2/3] Starting Express Backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$host.ui.RawUI.WindowTitle='SkillMatrix - Backend'; npm start" -WorkingDirectory "$BasePath\backend"

# Start Frontend
Write-Host "[3/3] Starting Vite Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$host.ui.RawUI.WindowTitle='SkillMatrix - Frontend'; npm run dev" -WorkingDirectory "$BasePath\frontend"

Write-Host ""
Write-Host "All services are booting up in separate windows!" -ForegroundColor Yellow
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
