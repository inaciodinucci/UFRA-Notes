import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ufranotes.settings')
django.setup()

from django.db import connection

def fix_migrations():
    """Fix migration issues by resetting database and recreating migrations"""
    try:
        print("🔧 Corrigindo migrações...")
        
        # Delete migration files (except __init__.py)
        migration_dirs = [
            'apps/users/migrations',
            'apps/notes/migrations', 
            'apps/activities/migrations'
        ]
        
        for migration_dir in migration_dirs:
            if os.path.exists(migration_dir):
                print(f"📁 Limpando {migration_dir}...")
                for file in os.listdir(migration_dir):
                    if file.endswith('.py') and file != '__init__.py':
                        file_path = os.path.join(migration_dir, file)
                        os.remove(file_path)
                        print(f"  🗑️ Removido: {file}")
        
        # Reset database tables
        print("🗑️ Limpando tabelas do banco de dados...")
        with connection.cursor() as cursor:
            # Drop all tables
            tables_to_drop = [
                'auth_group_permissions', 'auth_user_groups', 'auth_user_user_permissions',
                'django_admin_log', 'auth_permission', 'auth_group', 'django_content_type',
                'django_migrations', 'django_session', 'auth_user', 'users_user',
                'notes_note', 'notes_checkbox', 'notes_connection', 'notes_activity',
                'activities_activity', 'notes_note_activities'
            ]
            
            for table in tables_to_drop:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"  🗑️ Tabela {table} removida")
            
            # Create migrations table
            cursor.execute("""
            CREATE TABLE django_migrations (
                id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
                app varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                applied datetime(6) NOT NULL
            )
            """)
            print("  ✅ Tabela django_migrations criada")
        
        print("📦 Criando novas migrações...")
        # Create new migrations in correct order
        execute_from_command_line(['manage.py', 'makemigrations', 'users'])
        execute_from_command_line(['manage.py', 'makemigrations', 'activities'])
        execute_from_command_line(['manage.py', 'makemigrations', 'notes'])
        
        print("🚀 Aplicando migrações...")
        # Apply migrations
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Migrações corrigidas com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao corrigir migrações: {e}")
        sys.exit(1)

if __name__ == '__main__':
    fix_migrations() 