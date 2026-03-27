# restore-db.ps1
# Restora o backup.sql no Supabase PostgreSQL

param(
    [string]$DBHost = "db.neosulmlxizmelnudnjb.supabase.co",
    [string]$DBPort = "5432",
    [string]$DBUser = "postgres",
    [string]$DBName = "postgres",
    [string]$BackupFile = "backup.sql",
    [string]$CleanFile = "backup_clean.sql"
)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupPath = Join-Path $ProjectRoot $BackupFile
$CleanPath  = Join-Path $ProjectRoot $CleanFile

Write-Host "=== Portal Municipal - Database Restore ===" -ForegroundColor Cyan

# Verificar que o backup existe
if (-not (Test-Path $BackupPath)) {
    Write-Error "backup.sql nao encontrado em: $BackupPath"
    exit 1
}

# Passo 1: Limpar o backup (remover linha \restrict do Replit)
Write-Host ""
Write-Host "[1/4] Limpando backup.sql..." -ForegroundColor Yellow
$lines = Get-Content $BackupPath -Encoding UTF8
$cleaned = $lines | Where-Object { $_ -notmatch '^\s*\\restrict\s' }
$cleaned | Set-Content $CleanPath -Encoding UTF8
Write-Host "      -> Linhas originais: $($lines.Count)" -ForegroundColor Green
Write-Host "      -> Linhas apos limpeza: $($cleaned.Count)" -ForegroundColor Green

# Passo 2: Verificar psql
Write-Host ""
Write-Host "[2/4] Verificando psql..." -ForegroundColor Yellow
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCmd) {
    Write-Error "psql nao encontrado no PATH. Instale o PostgreSQL client tools."
    exit 1
}
Write-Host "      -> psql encontrado: $($psqlCmd.Source)" -ForegroundColor Green

# Configurar senha
$env:PGPASSWORD = "@Nexuscloud2025"

# Passo 3: Testar conexao
Write-Host ""
Write-Host "[3/4] Testando conexao com Supabase..." -ForegroundColor Yellow
$testResult = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -c 'SELECT version();' 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha na conexao com Supabase:" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Dica: Verifique as credenciais e a conectividade de rede." -ForegroundColor Yellow
    exit 1
}
Write-Host "      -> Conexao OK!" -ForegroundColor Green

# Passo 4: Restaurar
Write-Host ""
Write-Host "[4/4] Restaurando banco de dados..." -ForegroundColor Yellow
Write-Host "      (Pode demorar alguns minutos...)" -ForegroundColor DarkGray
$restoreOutput = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -f $CleanPath 2>&1

$restoreOutput | ForEach-Object {
    if ($_ -match "ERROR") {
        Write-Host "  [ERR] $_" -ForegroundColor Red
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Restore concluido com sucesso! ===" -ForegroundColor Green
    
    # Verificar tabelas criadas
    $tableCount = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -t -c 'SELECT count(*) FROM information_schema.tables WHERE table_schema = ''public'';' 2>&1
    Write-Host "  Total de tabelas: $($tableCount.Trim())" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Tabelas criadas:" -ForegroundColor Cyan
    $tables = & psql -h $DBHost -p $DBPort -U $DBUser -d $DBName -t -c 'SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'' ORDER BY 1;' 2>&1
    $tables | ForEach-Object { 
        $t = $_.Trim()
        if ($t -ne "") { Write-Host "  - $t" -ForegroundColor White }
    }
} else {
    Write-Host ""
    Write-Error "Restore falhou. Verifique os erros acima."
    exit 1
}
