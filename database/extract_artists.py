import csv
import ast


"""

CREATE TABLE artists (
    id                  
    name                
    albums_id           
    description         - tez nie ma po co
    country             - nie ma po co 
);

"""


def extract_artists(input_file, output_file):  
    songs_count = 0
    artists_count = 0

    _ARTISTS = []

    with open(input_file, 'r') as read_obj, \
        open(output_file, 'w', newline='') as write_obj:
        
        csv_reader = csv.reader(read_obj, delimiter=',')
        csv_writer = csv.writer(write_obj, delimiter='|')  

        ids = []            # stores already saved artists
            
        for index, row in enumerate(csv_reader):            
            if index == 0:
                csv_writer.writerow([
                    "id",
                    "name"
                ])
            else:           
                songs_count += 1
                artists_ids = ast.literal_eval(row[5])
                
                for index, _artist_id in enumerate(artists_ids):
                    if _artist_id not in ids:
                        _artist_name = ast.literal_eval(row[4])[index]
                        artist = {
                            "id"    : _artist_id,
                            "name"  : _artist_name,
                        }                 
                        
                        ids.append(_artist_id)
                        _ARTISTS.append(artist)                        
                        artists_count += 1
                    else:
                        # If artist already saved, do nothing
                        pass
                    
        for artist in _ARTISTS:        
            csv_writer.writerow([
                artist["id"],
                artist["name"]
            ])

    print("\nPiosenki: {}\nArtyści: {}\nID Artystów: {}\n".format(
        songs_count,
        artists_count,
        len(ids)
    ))             
            
                    
                
extract_artists('songs_sample.csv', 'artysci1.csv')