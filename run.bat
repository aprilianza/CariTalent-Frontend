@echo off
title CariTalent-Frontend Runner

echo ============================================
echo   CariTalent Frontend - Dev Server Runner
echo ============================================
echo.

:: Cek apakah npm tersedia
call npm --version >nul 2>&1
if errorlevel 1 goto :no_npm
goto :npm_ok

:no_npm
echo [ERROR] npm tidak ditemukan! Pastikan Node.js sudah terinstall.
echo         Download di: https://nodejs.org/en/download (pilih versi LTS)
pause
exit /b 1

:npm_ok
:: Cek versi Node.js
for /f "tokens=1" %%v in ('node -v') do set NODE_VERSION=%%v
echo [INFO] Node.js terdeteksi: %NODE_VERSION%

:: Ambil major version number
set NODE_MAJOR=%NODE_VERSION:v=%
for /f "delims=." %%a in ("%NODE_MAJOR%") do set NODE_MAJOR=%%a

:: Cek kompatibilitas Node.js
if %NODE_MAJOR% == 21 goto :node_error
if %NODE_MAJOR% == 19 goto :node_error
if %NODE_MAJOR% == 18 goto :node_error
if %NODE_MAJOR% LSS 18 goto :node_error
goto :node_ok

:node_error
echo.
echo [ERROR] Node.js %NODE_VERSION% TIDAK KOMPATIBEL dengan project ini!
echo.
echo         Project ini membutuhkan Node.js v20.19+ atau v22.12+ (LTS)
echo         Download: https://nodejs.org/en/download
echo.
pause
exit /b 1

:node_ok
echo [OK] Versi Node.js kompatibel.

:: Cek apakah package.json ada
if not exist package.json goto :no_pkg
goto :pkg_ok

:no_pkg
echo [ERROR] package.json tidak ditemukan di direktori ini!
pause
exit /b 1

:pkg_ok
:: Check if node_modules folder exists
if exist node_modules goto :skip_install

echo [INFO] node_modules belum ada. Menjalankan npm install...
echo.
call npm install
if errorlevel 1 goto :install_fail
echo.
echo [OK] Inisialisasi selesai!
goto :run_dev

:install_fail
echo.
echo [ERROR] npm install gagal! Periksa log error di atas.
pause
exit /b 1

:skip_install
echo [OK] node_modules sudah ada, melewati inisialisasi.

:run_dev
echo.
echo [INFO] Menjalankan Nuxt dev server...
echo [INFO] Browser akan otomatis terbuka di http://localhost:3000
echo [INFO] Tekan Ctrl+C untuk menghentikan server.
echo.

:: Buka browser setelah 10 detik
start /b cmd /c "timeout /t 10 /nobreak >nul && start http://localhost:3000"

:: Jalankan dev server
call npm run dev

echo.
echo [INFO] Server berhenti.
pause