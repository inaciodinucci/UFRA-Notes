@echo off
echo ===================================================
echo            UFRA Notes - Configuracao do Banco
echo ===================================================
echo.

REM Ativar ambiente virtual
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Verificar se mysql.exe pode ser encontrado
echo Verificando instalacao do MySQL...
where mysql >NUL 2>NUL
if %errorlevel% neq 0 (
  echo MySQL nao encontrado no PATH!
  echo Por favor instale o MySQL e adicione-o ao PATH do sistema.
  echo Download: https://dev.mysql.com/downloads/installer/
  pause
  exit /b 1
)

REM Solicitar informacoes de login MySQL
set /p MYSQL_USER=Digite o nome de usuario MySQL (padrao 'root'): 
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASSWORD=Digite a senha do MySQL: 

REM Executar o script de inicializacao do banco de dados
echo Criando banco de dados e tabelas...
mysql -u%MYSQL_USER% -p%MYSQL_PASSWORD% < backend\database_init.sql

if %errorlevel% neq 0 (
  echo Erro ao executar o script SQL.
  pause
  exit /b 1
)

echo.
echo Banco de dados configurado com sucesso!
echo.

REM Solicitar informacoes para arquivo .env
echo Configurando arquivo .env do Django...
echo.

REM Verificar se .env.example existe
if not exist backend\.env.example (
  echo Arquivo .env.example nao encontrado!
  pause
  exit /b 1
)

REM Copiar .env.example para .env
copy backend\.env.example backend\.env

REM Atualizar .env com valores informados pelo usuario
powershell -Command "(Get-Content backend\.env) -replace 'DB_USER=root', 'DB_USER=%MYSQL_USER%' | Set-Content backend\.env"
powershell -Command "(Get-Content backend\.env) -replace 'DB_PASSWORD=your-mysql-password', 'DB_PASSWORD=%MYSQL_PASSWORD%' | Set-Content backend\.env"

REM Confirmar que usuario quer aplicar as migracoes
echo.
echo Deseja aplicar as migracoes do Django agora? (S/N)
set /p APPLY_MIGRATIONS=

if /i "%APPLY_MIGRATIONS%"=="S" (
  echo Aplicando migracoes...
  cd backend
  python manage.py makemigrations
  python manage.py migrate
  cd ..
  
  echo.
  echo Deseja criar um superusuario para o admin? (S/N)
  set /p CREATE_SUPERUSER=
  
  if /i "%CREATE_SUPERUSER%"=="S" (
    cd backend
    python manage.py createsuperuser
    cd ..
  )
)

echo.
echo ===================================================
echo Configuracao do banco de dados concluida!
echo.
echo Agora voce pode iniciar a aplicacao com o arquivo "start.bat"
echo ===================================================
echo.

pause 