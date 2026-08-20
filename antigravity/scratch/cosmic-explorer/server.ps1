# ============================================================================
# COSMIC EXPLORER - ZERO-DEPENDENCY LOCAL WEB SERVER (PowerShell HttpListener)
# ============================================================================

$port = 8080
$prefix = "http://localhost:$port/"
$baseDir = $PSScriptRoot

if (-not $baseDir) {
    $baseDir = Get-Location
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Port $port in use, attempting port 8081..." -ForegroundColor Yellow
    $port = 8081
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🌌 COSMIC EXPLORER PLATFORM IS LIVE & ORBITING!" -ForegroundColor Green
Write-Host "🛰️ Local URL: $prefix" -ForegroundColor Cyan
Write-Host "📁 Serving from: $baseDir" -ForegroundColor Gray
Write-Host "Press Ctrl+C in this console to shut down the server." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

# Automatically launch the default web browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".htm"  = "text/html; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".svg"  = "image/svg+xml";
    ".ico"  = "image/x-icon";
    ".woff" = "font/woff";
    ".woff2"= "font/woff2";
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath
    if ($path -eq "/" -or $path -eq "") {
        $path = "/index.html"
    }

    $filePath = Join-Path $baseDir ($path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar))

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = $mimeTypes[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }

        $response.ContentType = $contentType
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.StatusCode = 200
    } else {
        $response.StatusCode = 404
        $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 - Cosmic Entity Not Found")
        $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
    }
    $response.OutputStream.Close()
}
