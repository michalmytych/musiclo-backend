CREATE TABLE tracks (
    id                  VARCHAR(22) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    albums_ids          VARCHAR(22) FOREIGN KEY NULL,
    artists_ids         VARCHAR(22) FOREIGN KEY NULL,
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
);

CREATE TABLE albums (
    id                  VARCHAR(22) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    artist_ids          VARCHAR(22) FOREIGN KEY NULL,
    songs_ids           VARCHAR(22) FOREIGN KEY NOT NULL,
    explicit            BIT NOT NULL,
    release_date        DATE,
);

CREATE TABLE artists (
    id                  VARCHAR(22) PRIMARY KEY,
    name                VARCHAR(128) NOT NULL,
    albums_id           VARCHAR(22) FOREIGN KEY NULL,
    description         TEXT(516) NOT NULL,
    country             VARCHAR(2)
);