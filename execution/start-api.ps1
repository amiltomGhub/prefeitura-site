# start-api.ps1
# Inicia o API Server do Portal Municipal
# Uso: .\execution\start-api.ps1

param(
    [int]$Port = 8080
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "=== Iniciando API Server (porta $Port) ===" -ForegroundColor Cyan

# Carregar .env.local
$EnvFile = Join-Path $ProjectRoot ".env.local"
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $key = $Matches[1].Trim()
            $val = $Matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
    Write-Host "Variaveis carregadas do .env.local" -ForegroundColor Green
} else {
    Write-Warning ".env.local nao encontrado. Verifique as variaveis de ambiente."
}

# Build da API
Write-Host "`nBuild da API..." -ForegroundColor Yellow
& pnpm --filter "@workspace/api-server" run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build falhou!"
    exit 1
}

Write-Host "`nIniciando servidor na porta $Port..." -ForegroundColor Green
$env:PORT = $Port
node --enable-source-maps "./artifacts/api-server/dist/index.mjs"
