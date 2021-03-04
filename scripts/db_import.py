import psycopg2
from psycopg2 import Error
from lxml import etree

try:
    # Connect to an existing database
    connection = psycopg2.connect(user="postgres",
                                  password="1234",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="recordset")

    # Create a cursor to perform database operations
    cursor = connection.cursor()
    # Print PostgreSQL details
    print("PostgreSQL server information")
    print(connection.get_dsn_parameters(), "\n")
    # Executing a SQL query
    cursor.execute("SELECT version();")
    # Fetch result
    record = cursor.fetchone()
    print("You are connected to - ", record, "\n")

    # Begin import

    root = etree.parse("jobs_feed.xml")

    for i in root.findall("record"):
        p = [i.find(n).text for n in ("firma", 
        "titel", "id", "volltext", "plz_arbeitsort",
        "arbeitsort", "vondatum", "stellenlink",
        "jobtype", "category")]

        postgres = """INSERT INTO records (firma, titel, job_id, volltext, plz_arbeitsort, arbeitsort, vondatum, stellenlink, jobtype, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(postgres, p)
        connection.commit()

except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
finally:
    if (connection):
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")