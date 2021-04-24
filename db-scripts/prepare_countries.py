import csv
from os import system

HEADER = "INSERT INTO countries (`iso_code`, `name`) VALUES\n"

def get_countries_inserts(input_file, output_file):  
    """
        Generates sql script for
        countries table insertions.
    """         
    with open(input_file, 'r') as read_obj, \
        open(output_file, 'w') as sql_script:
        
        csv_reader = csv.reader(read_obj, delimiter=',')
            
        sql_script.write(HEADER)
        
        for index, row in enumerate(csv_reader):            
            system('clear')
            print(f"Przetworzono {index} rekordów")
            if index != 0:
                sql_script.write(f'("{row[0]}", "{row[1]}"),\n')


get_countries_inserts('countries.csv', 'countries_inserts.sql')