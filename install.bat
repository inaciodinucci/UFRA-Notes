@echo off
echo ===================================================
echo            UFRA Notes - Instalacao
echo ===================================================
echo.

REM Verificar se Python esta instalado
echo Verificando a instalacao do Python...
python --version 2>NUL
if %errorlevel% neq 0 (
  echo Python nao encontrado! Por favor, instale o Python 3.8 ou superior.
  echo Download: https://www.python.org/downloads/
  pause
  exit /b 1
)

REM Verificar se Node.js esta instalado
echo Verificando a instalacao do Node.js...
node --version 2>NUL
if %errorlevel% neq 0 (
  echo Node.js nao encontrado! Por favor, instale o Node.js 14 ou superior.
  echo Download: https://nodejs.org/
  pause
  exit /b 1
)

REM Criar ambiente virtual Python
echo Criando ambiente virtual Python...
python -m venv venv

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Instalar dependencias do backend
echo Instalando dependencias do backend...
cd backend
pip install -r requirements.txt

REM Voltar para a pasta raiz
cd ..

REM Instalar dependencias do frontend
echo Instalando dependencias do frontend...
cd frontend
npm install

REM Voltar para a pasta raiz
cd ..

echo.
echo ===================================================
echo Instalacao concluida com sucesso!
echo.
echo Proximos passos:
echo 1. Configure seu banco de dados MySQL usando o arquivo 'backend/database_init.sql'
echo 2. Crie um arquivo .env na pasta backend baseado no .env.example
echo 3. Execute 'start.bat' para iniciar a aplicacao
echo ===================================================
echo.

pause 