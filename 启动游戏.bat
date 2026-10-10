@echo off
chcp 65001 >nul
title WallCity 围墙之城
cd /d "%~dp0"

echo ==========================================
echo   WallCity 围墙之城 - 本地启动
echo ==========================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo [错误] 没有找到 Python。
  echo 请先安装 Python 3（https://www.python.org/downloads/），
  echo 或者用 VS Code 的 Live Server 插件打开 index.html。
  echo.
  pause
  exit /b 1
)

echo 正在启动本地服务器，稍后会自动打开浏览器...
echo 关闭这个窗口就会停止服务器。
echo.

python tools\serve.py --port 8080
pause
