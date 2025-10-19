import psycopg2

print("Starting connection test...")

try:
    connection = psycopg2.connect(
        host="localhost",
        database="volunteer_unite",
        user="postgres",         
        password="1234" 
    )
    print("Connection object created!")

    cursor = connection.cursor()
    print("Cursor created!")

    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print("Connected to PostgreSQL! Version:", db_version)

except Exception as e:
    print("Error connecting to database:", str(e))


finally:
    if 'connection' in locals():
        cursor.close()
        connection.close()
        print("Connection closed.")
