@echo off
echo ===================================================
echo            UFRA Notes - Iniciando Servidores
echo ===================================================
echo.

REM Verificar se o ambiente virtual existe
if not exist venv (
  echo Ambiente virtual nao encontrado!
  echo Execute 'install.bat' antes de iniciar os servidores.
  pause
  exit /b 1
)

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Verificar instalação do Django
python -c "import django" >nul 2>&1
if %errorlevel% neq 0 (
  echo Django nao encontrado no ambiente virtual!
  echo Instalando dependencias...
  cd backend
  pip install -r requirements.txt
  cd ..
)

REM Verificar e instalar dependências do frontend
cd frontend
echo Verificando dependencias do frontend...
if not exist node_modules (
  echo Instalando pacotes do frontend...
  call npm install
)

REM Adicionar concurrently como dependência local do projeto
echo Verificando concurrently...
call npm list concurrently >nul 2>&1
if %errorlevel% neq 0 (
  echo Instalando concurrently localmente...
  call npm install --save-dev concurrently
)

cd ..

REM Verificar migrações do Django
cd backend
echo Verificando migracoes do Django...
python manage.py showmigrations | findstr "\[ \]" >nul
if %errorlevel% equ 0 (
  echo Aplicando migracoes pendentes...
  python manage.py migrate --fake-initial
)
cd ..

REM Iniciar servidores usando npx concurrently
echo.
echo Iniciando servidores Backend (Django) e Frontend (React)...
echo.
echo ATENCAO: Os servidores serao encerrados quando voce fechar esta janela
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.

cd frontend
npx concurrently --kill-others-on-fail --names "BACKEND,FRONTEND" --prefix-colors "blue.bold,green.bold" --prefix "[{name}]" "cd ../backend && python manage.py runserver" "npm start"

REM Se os servidores forem fechados, todas as tarefas serao encerradas automaticamente
echo.
echo ===================================================
echo Servidores encerrados!
echo ===================================================

pause 