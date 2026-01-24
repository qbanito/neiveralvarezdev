@echo off
echo ================================
echo  OMNIA - Sistema CRM Inteligente
echo ================================
echo.
echo Iniciando servicios...
echo.

REM Iniciar API CRM en nueva ventana
start "OMNIA CRM API" cmd /k "cd api && npm start"

REM Esperar 3 segundos
timeout /t 3 /nobreak >nul

REM Iniciar Frontend
start "OMNIA Frontend" cmd /k "npm run dev"

echo.
echo ✅ Servicios iniciados:
echo    - API CRM: http://localhost:3001
echo    - Frontend: http://localhost:3000
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

start http://localhost:3000

echo.
echo Para detener los servicios, cierra las ventanas de terminal.
echo.
pause
