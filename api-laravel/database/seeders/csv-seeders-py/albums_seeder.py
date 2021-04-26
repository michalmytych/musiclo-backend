import csv
import ast
from dotenv import dotenv_values
import mysql.connector


class AlbumCsvSeeder:
    """
        * * * * * * * * AlbumsCsvSeeder * * * * * * * * * * *
        Inserts records into the albums table from a csv file,
        then creates a relationships with other tables based on
        arrays of primary keys (songs_ids, albums_ids)
    """

    csv_file_uri = '../seeds/csvs/albums.csv'
    logfile_uri = '_albums_seeder.log'
    csv_delimiter = '|'

    albums_sql_header = 'insert into albums (`id`, `name`, `release_date`, `spotify_link`) values '
    album_artist_sql_header = 'insert into album_artist (`id`, `artist_id`, `album_id`) values '
    songs_sql_header = 'update songs set `album_id` = '

    albums_sql = ''
    album_artist_sql = ''
    songs_sql = ''

    row_index = 0
    row = []
    errors_count = 0

    csv_reader = None
    cursor = None

    def __init__(self):
        DB_CONFIG = dotenv_values(".env")
        self.db = mysql.connector.connect(
            host=DB_CONFIG['DB_HOST'],
            port=DB_CONFIG['DB_PORT'],
            database=DB_CONFIG['DB_DATABASE'],
            user=DB_CONFIG['DB_USERNAME'],
            password=DB_CONFIG['DB_PASSWORD']
        )

    def log_error(self, logfile, exception):
        logfile.write("Error while processing row {}: \n".format(self.row_index))
        logfile.write(",".join(self.row) + "\n")
        logfile.write("Exception: \n")
        logfile.write(str(exception) + "\n")
        logfile.write(("-" * 300) + "\n\n")
        self.errors_count += 1

    def seed_all(self):
        self.cursor = self.db.cursor()

        with open(self.csv_file_uri, 'r') as file, \
            open(self.logfile_uri, 'a', newline='') as logfile:

            self.csv_reader = csv.reader(file, delimiter=self.csv_delimiter)

            for index, _row in enumerate(self.csv_reader):
                self.row_index = index
                self.row = _row

                if self.row_index == 0:
                    continue
                else:
                    try:
                        self.seed_albums([
                            self.row[0],
                            self.row[1],
                            self.row[4],
                            self.row[5]
                        ])
                    except Exception as exception:
                        print("> Error: ", str(exception))
                        self.log_error(logfile, exception)

                    try:
                        self.seed_album_artist({
                            "artists_ids": self.row[2],
                            "album_id": self.row[0]
                        })
                    except Exception as exception:
                        print("> Error: ", str(exception))
                        self.log_error(logfile, exception)

                    try:
                        self.seed_songs({
                            "songs_ids": self.row[3],
                            "album_id": self.row[0]
                        })
                    except Exception as exception:
                        print("> Error: ", str(exception))
                        self.log_error(logfile, exception)

        self.db.commit()

    def seed_albums(self, columns):
        if len(columns) < 4:
            raise Exception('Not enough rows to fill SQL values string!')
        else:
            self.albums_sql = self.albums_sql_header
            sql_values_string = ' ("{}", "{}", "{}", "{}");'
            self.albums_sql += sql_values_string.format(*columns)

            try:
                self.cursor.execute(self.albums_sql)
            except Exception as e:
                raise Exception("Error! :: " + str(e))

    def seed_album_artist(self, columns):
        if len(columns) < 2:
            raise Exception('Not enough rows to fill SQL values string!')

        for artist_id in ast.literal_eval(columns['artists_ids']):
            self.album_artist_sql = self.album_artist_sql_header
            self.album_artist_sql += '(NULL, "{}", "{}");'.format(
                columns['album_id'],
                artist_id
            )

            try:
                self.cursor.execute(self.album_artist_sql)
            except Exception as e:
                raise Exception("Error! :: " + str(e))

    # adding relation at songs table
    # call only if songs table is already filled
    def seed_songs(self, columns):
        for song_id in ast.literal_eval(columns['songs_ids']):
            self.songs_sql = self.songs_sql_header
            self.songs_sql += '"{}" where songs.id = "{}"'.format(
                columns['album_id'],
                song_id
            )
            self.songs_sql += ";"

            try:
                self.cursor.execute(self.songs_sql)
            except Exception as e:
                raise Exception("Error! :: " + str(e))

        print(self.songs_sql)

    def __del__(self):
        self.db.close()


seeder = AlbumCsvSeeder()

seeder.seed_all()
