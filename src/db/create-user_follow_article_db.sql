DROP DATABASE IF EXISTS medium;   
CREATE DATABASE IF NOT EXISTS medium;   
USE medium; 

DROP TABLE IF EXISTS user_follow_article; 

CREATE TABLE IF NOT EXISTS user_follow_article 
  ( 
     id           INT PRIMARY KEY auto_increment, 
     user_id      INT(11) NOT NULL,
     article_id   INT(11) NOT NULL,
     following    BOOLEAN NOT NULL DEFAULT FALSE
  );