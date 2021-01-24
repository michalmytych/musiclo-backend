from csv import reader
from os import system
import ast

HEADER = "INSERT INTO belongs_to (`album_id`, `artist_id`) VALUES\n"

def get_belongs_to_inserts(config):
    input_file = config["input_file"]
    output_file = config["output_file"]

    with open(input_file, 'r') as read_obj:
        with open(output_file, 'w') as sql_file_obj:
            csv_reader = reader(read_obj, delimiter='|')

            sql_file_obj.write(HEADER)

            for index, row in enumerate(csv_reader):            
                if index != 0: 
                    if index == 1: 
                        sql_file_obj.write(f'(')   
                    
                    print(f"> Przetworzono {index} rekordów.")

                    _album_id = row[0]
                    _artists_ids = ast.literal_eval(row[2])                    

                    # sql_file_obj.write(f'(')                    
                    for i in _artists_ids:  
                        sql_file_obj.write(f'"{_album_id}"')                                                
                        sql_file_obj.write(f', "{i}"')                    
                        sql_file_obj.write(f'),\n')
                        sql_file_obj.write(f'(') 
        

get_belongs_to_inserts({
    "input_file"    :  'db_projekt/csvs/albums.csv', 
    "output_file"   :  'belongs_to_inserts.sql'
})