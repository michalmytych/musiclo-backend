import csv
import random


DATA_DIR = '.'


# SQL_INSERT_HEADER = "INSERT into {}".format()

rows = [(1,7,3000), (1,8,3500), (1,9,3900)]

"""
    id                  VARCHAR(22) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    albums_ids          VARCHAR(22) FOREIGN KEY,
    artists_ids         VARCHAR(22) FOREIGN KEY,
    explicit            BIT NOT NULL,
    danceability        FLOAT(3),
    energy              FLOAT(3),
    key                 INT(2),
    mode                BIT,
    acousticness        FLOAT(3),
    instrumentalness    FLOAT(3),
    valence             FLOAT(3),
    release_date        DATE,
    spotify_link        VARCHAR(96)
"""


def extract_songs(filename):
    with open(filename, newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
        
        _songs = []

        for row in spamreader:
            song = tuple(
                row[]
            )

        values = ', '.join(map(str, rows))
        sql = "INSERT INTO {} VALUES {}".format("songs", values)

