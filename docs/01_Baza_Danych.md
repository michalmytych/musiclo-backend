* [Wróć](README.md)
# Baza Danych
### Skrypt tworzący strukturę tabel
```sql
/*
Sprawdzane w konfiguracji:
 -- -- -- -- SHOW VARIABLES LIKE "%version%"; query result: -- -- -- --
innodb_version,5.7.29
protocol_version,10
slave_type_conversions,""
tls_version,"TLSv1,TLSv1.1,TLSv1.2"
version,5.7.29
version_comment,MySQL Community Server (GPL)
version_compile_machine,x86_64
version_compile_os,Linux
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
*/

DROP TABLE IF EXISTS recorded_by;
DROP TABLE IF EXISTS belongs_to;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS albums;

CREATE TABLE IF NOT EXISTS albums (
    `id`                VARCHAR(24) UNIQUE,
    `name`              VARCHAR(196) NOT NULL,
    `release_date`      DATE DEFAULT NULL,
    `spotify_link`      VARCHAR(128) NULL,
    `created_at`        DATETIME DEFAULT NOW(),
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS songs (
    `id`                VARCHAR(24) UNIQUE,
    `name`              VARCHAR(128) NOT NULL,
    `explicit`          BIT NULL,
    `key`               TINYINT NULL,
    `mode`              BIT NULL,
    `danceability`      FLOAT(3) NULL,
    `energy`            FLOAT(3) NULL,
    `acousticness`      FLOAT(3) NULL,
    `instrumentalness`  FLOAT(3) NULL,
    `valence`           FLOAT(3) NULL,
    `release_date`      DATE DEFAULT NULL,
    `spotify_link`      VARCHAR(128) NULL,
    `album_id`          VARCHAR(24) NULL,
    `created_at`        DATETIME DEFAULT NOW(),
    PRIMARY KEY(`id`),
    FOREIGN KEY (`album_id`)
        REFERENCES albums(`id`)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS countries (
    `iso_code`          VARCHAR(3) UNIQUE,
    `name`              VARCHAR(128) NOT NULL,
    PRIMARY KEY(iso_code)
);

CREATE TABLE IF NOT EXISTS artists (
    `id`                VARCHAR(24) UNIQUE,
    `name`              VARCHAR(128) NOT NULL,
    `description`       TEXT(516) NULL,
    `country`           VARCHAR(2) NULL,
    `spotify_link`      VARCHAR(128) NULL,
    `created_at`        DATETIME DEFAULT NOW(),
    PRIMARY KEY(`id`),
    FOREIGN KEY (`country`)
        REFERENCES countries(`iso_code`)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recorded_by (
    `id`               INT AUTO_INCREMENT,
    `track_id`         VARCHAR(24) NOT NULL,
    `artist_id`        VARCHAR(24) NOT NULL,
    UNIQUE (`track_id`, `artist_id`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`track_id`)
        REFERENCES songs(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`artist_id`)
        REFERENCES artists(`id`)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS belongs_to (
    `id`              INT AUTO_INCREMENT,
    `album_id`        VARCHAR(24) NOT NULL,
    `artist_id`       VARCHAR(24) NOT NULL,
    UNIQUE (`album_id`, `artist_id`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`album_id`)
        REFERENCES albums(`id`)
        ON DELETE CASCADE,
    FOREIGN KEY (`artist_id`)
        REFERENCES artists(`id`)
        ON DELETE CASCADE
);


```