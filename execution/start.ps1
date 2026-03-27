# start.ps1 - Portal Municipal Inteligente - Script de Inicialização
# Executa API server e Frontend em dois terminais PowerShell separados

$env:DATABASE_URL = "postgresql://postgres:%40%40Senha2026@db.lazpvumylgubbtzcywft.supabase.co:5432/postgres"
$env:NODE_ENV = "development"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " Portal Municipal Inteligente - Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Iniciar API Server
Write-Host ""
Write-Host "[1/2] Iniciando API Server (porta 8080)..." -ForegroundColor Yellow
$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:DATABASE_URL = $using:env:DATABASE_URL
    $env:PORT = "8080"
    $env:NODE_ENV = "development"
    $env:SESSION_SECRET = "portal-municipal-secret-2026"
    node --enable-source-maps artifacts/api-server/dist/index.mjs
}

Start-Sleep -Seconds 3

# Verificar se API subiu
try {
    $health = Invoke-RestMethod "http://localhost:8080/api/healthz" -TimeoutSec 5
    if ($health.status -eq "ok") {
        Write-Host "      -> API online! Status: $($health.status)" -ForegroundColor Green
    }
} catch {
    Write-Host "      -> API ainda subindo..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[2/2] Frontend (porta 21851)..." -ForegroundColor Yellow
Write-Host "      Para iniciar o frontend manualmente, abra outro terminal e execute:" -ForegroundColor DarkGray

Write-Host ""
Write-Host "  cd 'c:\Antigravity\prefeitura\artifacts\portal-municipal'" -ForegroundColor White
Write-Host '  $env:PORT = "21851"; $env:BASE_PATH = "/"; $env:NODE_ENV = "development"' -ForegroundColor White
Write-Host "  .\node_modules\.bin\vite.CMD --host 0.0.0.0" -ForegroundColor White

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " Acesso:" -ForegroundColor Cyan
Write-Host "   API:      http://localhost:8080/api/healthz" -ForegroundColor White
Write-Host "   Portal:   http://localhost:21851" -ForegroundColor White
Write-Host "   Tenant:   parauapebas" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor DarkGray

# Aguardar jobs
Receive-Job $apiJob -Wait
