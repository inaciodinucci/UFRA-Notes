import os
import shutil
import MySQLdb

def reset_migrations():
    # 1. Delete all migration files except __init__.py
    migration_dirs = [
        'apps/users/migrations',
        'apps/notes/migrations',
        'apps/activities/migrations'
    ]
    
    for dir_path in migration_dirs:
        if os.path.exists(dir_path):
            print(f"Processing {dir_path}...")
            for filename in os.listdir(dir_path):
                if filename != '__init__.py' and filename.endswith('.py'):
                    file_path = os.path.join(dir_path, filename)
                    print(f"  Removing {file_path}")
                    os.remove(file_path)
                    
                # Also remove pycache files
                pycache_path = os.path.join(dir_path, '__pycache__')
                if os.path.exists(pycache_path):
                    print(f"  Removing {pycache_path}")
                    shutil.rmtree(pycache_path)
        else:
            print(f"Directory {dir_path} not found, creating it...")
            os.makedirs(dir_path, exist_ok=True)
            # Create __init__.py if it doesn't exist
            init_file = os.path.join(dir_path, '__init__.py')
            if not os.path.exists(init_file):
                with open(init_file, 'w') as f:
                    pass
    
    # 2. Reset the database
    try:
        conn = MySQLdb.connect(
            host="localhost",
            user="root",
            passwd=""
        )
        
        cursor = conn.cursor()
        
        # Drop and recreate database
        cursor.execute("DROP DATABASE IF EXISTS ufranotes")
        cursor.execute("CREATE DATABASE ufranotes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("Database reset successfully")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_migrations()
    print("\nReset complete! Now run:")
    print("1. python manage.py makemigrations users")
    print("2. python manage.py makemigrations notes activities")
    print("3. python manage.py migrate") 