param(
  [int]$Port = 8787
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$WebRoot = Join-Path $RepoRoot "web"

if (-not (Test-Path -LiteralPath $WebRoot)) {
  Write-Error "Web directory not found: $WebRoot"
}

Write-Host ""
Write-Host "SMP Composer"
Write-Host "URL: http://localhost:$Port"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

python -m http.server $Port --directory $WebRoot

