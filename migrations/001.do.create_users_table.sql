DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    first_name text NOT NULL, 
    last_name text NOT NULL, 
    email VARCHAR NOT NULL, 
    user_password VARCHAR NOT NULL, 
    student boolean NOT NULL, 
    tutor boolean NOT NULL,
    gender VARCHAR NOT NULL,
    rating INTEGER DEFAULT NULL
)