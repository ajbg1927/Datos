import pymysql

try:
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="excel_data"
    )
    print("Conexión exitosa")
    connection.close()
except pymysql.err.OperationalError as e:
    print(f"Error de conexión: {e}")