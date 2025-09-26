import mysql.connector
from mysql.connector import Error
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ufranotes.settings')
django.setup()

def reset_database():
    """Reset and create database with proper configuration"""
    try:
        print("🔧 Conectando ao MySQL...")
        # Connect to MySQL server without selecting a database
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""  # assuming no password as per .env file
        )
        
        if conn.is_connected():
            cursor = conn.cursor()
            
            # Drop database if exists
            cursor.execute("DROP DATABASE IF EXISTS ufranotes")
            print("🗑️ Banco de dados removido (se existia)")
            
            # Create database
            cursor.execute("CREATE DATABASE ufranotes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✅ Banco de dados 'ufranotes' criado com sucesso")
            
            cursor.close()
            conn.close()
            print("🔌 Conexão MySQL fechada")
            
            # Now run Django migrations
            print("📦 Executando migrações do Django...")
            from django.core.management import execute_from_command_line
            execute_from_command_line(['manage.py', 'migrate'])
            
            # Create superuser
            print("👤 Criando superusuário...")
            from django.contrib.auth import get_user_model
            User = get_user_model()
            
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@ufra.com',
                    password='admin123'
                )
                print("✅ Superusuário criado: admin/admin123")
            else:
                print("ℹ️ Superusuário já existe")
            
            print("🎉 Configuração do banco de dados concluída!")
            return True
            
    except Error as e:
        print(f"❌ Erro MySQL: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro geral: {e}")
        return False

if __name__ == "__main__":
    reset_database() 