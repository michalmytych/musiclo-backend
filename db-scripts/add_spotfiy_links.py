from csv import writer
from csv import reader


def add_column_in_csv(input_file, output_file, category):
    """ 
        Appends spotify embed link as new column.
        Link is constructed of item's id and prefix,
        which is different for album, song or artist.
    """
    with open(input_file, 'r') as read_obj, \
            open(output_file, 'w', newline='') as write_obj:
        csv_reader = reader(read_obj, delimiter='|')
        csv_writer = writer(write_obj, delimiter='|')
        
        for index, row in enumerate(csv_reader):
            if index == 0: 
                new_row_name = 'spotify_link' 
                row.append(new_row_name)              
                csv_writer.writerow(row)
            else:
                # adding adequate prefix by category
                if category == "songs":
                    link = "https://open.spotify.com/embed/track/{}".format(row[0])
                elif category == "albums":
                    link = "https://open.spotify.com/embed/album/{}".format(row[0])
                elif category == "artists":
                    link = "https://open.spotify.com/embed/artist/{}".format(row[0])

                row.append(link)
                csv_writer.writerow(row)

add_column_in_csv("artysci1.csv", "artysci_z_linkami.csv", "artists")