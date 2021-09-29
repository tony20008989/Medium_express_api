DROP DATABASE IF EXISTS medium;   
CREATE DATABASE IF NOT EXISTS medium;   
USE medium; 

DROP TABLE IF EXISTS user_bookmark_article; 

CREATE TABLE IF NOT EXISTS user_bookmark_article 
  ( 
     id           INT PRIMARY KEY auto_increment, 
     user_id      INT(11) NOT NULL,
     article_id   INT(11) NOT NULL,
     bookmark     BOOLEAN NOT NULL DEFAULT FALSE
  );