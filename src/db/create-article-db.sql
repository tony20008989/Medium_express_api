DROP DATABASE IF EXISTS medium;   
CREATE DATABASE IF NOT EXISTS medium;   
USE medium; 

DROP TABLE IF EXISTS article; 

CREATE TABLE IF NOT EXISTS article 
  ( 
     id           INT PRIMARY KEY auto_increment, 
     title        VARCHAR(25) UNIQUE NOT NULL, 
     content      TEXT NOT NULL, 
     author_id    INT(11) NOT NULL,
     is_premium   BOOLEAN NOT NULL DEFAULT FALSE,
     created_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	   update_time  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
  );