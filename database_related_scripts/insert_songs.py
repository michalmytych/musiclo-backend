from csv import reader
from os import system

HEADER = "INSERT INTO songs (`id`, `name`, `album_id`, `explicit`, `danceability`, \
    `energy`, `key`, `mode`, `acousticness`, `instrumentalness`, `valence`,\
         `release_date`, `spotify_link`) VALUES\n"
fixed_rows = []
dropped_rows = []


def get_artists_inserts(config):
    """
        Extracts needed songs data
        from raw dataset.
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
                    _album_id = row[3]
                    name = row[1]     
                    bad_release_date = False             

                    if len(_id) != 22:
                        dropped_rows.append(index)
                    else:
                        if len(_album_id) != 22:
                            fixed_rows.append(index)
                            _album_id = 'NULL'
                        else:
                            _album_id = f'"{_album_id}", '

                        if '"' in name:
                            fixed_rows.append(index)
                            name = name.replace('"', "'")
                        
                        if len(fixed_rows) or len(dropped_rows):
                            print(f"> Naprawiono {len(fixed_rows)} liniii.")                     
                            print("> Usunięto linie: ")    
                            print(f"> {dropped_rows}")

                        if len(row[13]) < 10:
                            bad_release_date = True
                            if len(fixed_rows):
                                if fixed_rows[-1] != index:
                                    fixed_rows.append(index)

                        sql_file_obj.write("(")
                        sql_file_obj.write(f'"{row[0]}", ')         # id
                        sql_file_obj.write(f'"{name}", ')           # name
                        sql_file_obj.write(_album_id)               # album id
                        sql_file_obj.write(f'{row[5]}, ')           # explicit
                        sql_file_obj.write(f'{row[6]}, ')           # danceability
                        sql_file_obj.write(f'{row[7]}, ')           # energy
                        sql_file_obj.write(f'{row[8]}, ')           # key
                        sql_file_obj.write(f'{row[9]}, ')           # mode
                        sql_file_obj.write(f'{row[10]}, ')          # acousticness
                        sql_file_obj.write(f'{row[11]}, ')          # instrumentalness
                        sql_file_obj.write(f'{row[12]}, ')          # valence
                        if bad_release_date:                         
                            sql_file_obj.write(f'NULL, ')           # release_date
                        else:
                            sql_file_obj.write(f'"{row[13]}", ')
                        sql_file_obj.write(f'"{row[14]}"')          # spotify_link
                        sql_file_obj.write("),\n")
    
        

get_artists_inserts({
    "input_file"    :  'csvs/songs.csv', 
    "output_file"   :  'songs_inserts.sql'
})