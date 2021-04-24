from csv import reader
from os import system

HEADER = "INSERT INTO albums (`id`, `name`, `release_date`, `spotify_link`) VALUES\n"
fixed_rows = []
dropped_rows = []


def get_artists_inserts(config):    
    """
        Extracts needed albums data
        from raw dataset which contains
        tracks.
    """
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

                    _id = row[0]
                    name = row[1]     
                    bad_release_date = False             

                    if len(_id) != 22:
                        dropped_rows.append(index)
                    else:
                        if '"' in name:
                            fixed_rows.append(index)
                            name = name.replace('"', "'")
                        
                        if len(fixed_rows) or len(dropped_rows):
                            print("> Naprawiono linie: ")    
                            print(f"> {fixed_rows}")                    
                            print("> Usunięto linie: ")    
                            print(f"> {dropped_rows}")

                        if len(row[4]) < 10:
                            bad_release_date = True
                            if len(fixed_rows):
                                if fixed_rows[-1] != index:
                                    fixed_rows.append(index)

                        sql_file_obj.write("(")
                        sql_file_obj.write(f'"{row[0]}", ')         # id
                        sql_file_obj.write(f'"{name}", ')           # name
                        if bad_release_date:                         
                            sql_file_obj.write(f'NULL, ')           # release_date
                        else:
                            sql_file_obj.write(f'"{row[4]}", ')
                        sql_file_obj.write(f'"{row[5]}"')           # spotify_link
                        sql_file_obj.write("),\n")
    
        

get_artists_inserts({
    "input_file"    :  'csvs/albums.csv', 
    "output_file"   :  'albums_inserts.sql'
})