@echo off
title Cosmic Explorer Launcher
echo Launching Cosmic Explorer...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
