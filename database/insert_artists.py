from csv import reader
from os import system

HEADER = "INSERT INTO artists (`id`, `name`, `spotify_link`) VALUES\n"
fixed_rows = []

def get_artists_inserts(config):
    input_file = config["input_file"]
    output_file = config["output_file"]

    with open(input_file, 'r') as read_obj:
        with open(output_file, 'w') as sql_file_obj:
            csv_reader = reader(read_obj, delimiter='|')

            sql_file_obj.write(HEADER)

            for index, row in enumerate(csv_reader):            
                if index != 0: 
                    system("clear")
                    print(f"> Przetworzono {index} rekordów.")

                    name = row[1]

                    if '"' in name:
                        fixed_rows.append(index)
                        name = name.replace('"', "'")
                    
                    if len(fixed_rows) > 0:
                        print("> Naprawiono linie: ")    
                        print(f"> {fixed_rows}")

                    sql_file_obj.write("(")
                    sql_file_obj.write(f'"{row[0]}", ')     # id
                    sql_file_obj.write(f'"{name}", ')     # name
                    sql_file_obj.write(f'"{row[2]}"')       # spotify_link
                    sql_file_obj.write("),\n")
    
        

get_artists_inserts({
    "input_file"    :  'csvs/artists.csv', 
    "output_file"   :  'artists_inserts.sql'
})