import csv


def check_ids(input_file):    
    """
        Simply checks if all values from
        first row are unique.
    """
    _IDS = []
    repeated_count = 0

    with open(input_file, 'r') as read_obj:        
        csv_reader = csv.reader(read_obj, delimiter='|')
        
        for index, row in enumerate(csv_reader):
            if index == 0:
                pass
            else:  
                if row[0] in _IDS:
                    print(">> Powtórzone ID w linijce {}".format(index+1))
                    _IDS.append(row[0])
                    repeated_count += 1
                else:
                    _IDS.append(row[0])

    if not repeated_count:
        print("\n*** Nie znaleziono powtórzonych ID. ***\n")
    else:
        print("\n*** Znaleziono {} powtórzone ID. ***\n".format(repeated_count))


check_ids('pierwsze_cos/albumss.csv')