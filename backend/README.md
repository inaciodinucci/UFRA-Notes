# UFRA Notes Backend

Backend da aplicação UFRA Notes, desenvolvido em Django e Django REST Framework.

## Características

- API REST para gerenciamento de notas com lembretes
- Sistema de autenticação JWT
- Funcionalidades de gamificação com tema RPG
- Sistema de mapa mental para conectar notas
- Notificações e lembretes automáticos

## Requisitos

- Python 3.8+
- PostgreSQL
- Redis (para Celery)

## Configuração

1. Clone o repositório
2. Crie um ambiente virtual:
   ```
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
5. Crie um arquivo `.env` baseado no `.env.example`
6. Configure o banco de dados PostgreSQL
7. Execute as migrações:
   ```
   python manage.py migrate
   ```
8. Crie um superusuário:
   ```
   python manage.py createsuperuser
   ```
9. Inicie o servidor:
   ```
   python manage.py runserver
   ```
10. Em outro terminal, inicie o worker do Celery:
    ```
    celery -A ufranotes worker -l info
    ```
11. Para agendar tarefas periódicas:
    ```
    celery -A ufranotes beat -l info
    ```

## Estrutura do Projeto

- `ufranotes/`: Configurações centrais do Django
- `apps/users/`: Gerenciamento de usuários e autenticação
- `apps/notes/`: Recursos para notas, lembretes e checkboxes
- `apps/activities/`: Sistema de atividades gamificadas

## API Endpoints

- `api/auth/`: Autenticação (login/register)
- `api/users/`: Gerenciamento de usuários
- `api/notes/`: CRUD de notas
  - `api/notes/mindmap/`: Visualização do mapa mental
- `api/activities/`: Gerenciamento de atividades

## Desenvolvimento

Para gerar migrações após alterações nos modelos:

```
python manage.py makemigrations
```

Verificar tarefas do Celery:

```
celery -A ufranotes inspect active
``` 