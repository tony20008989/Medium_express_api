DROP DATABASE IF EXISTS medium;   
CREATE DATABASE IF NOT EXISTS medium;   
USE medium; 

DROP TABLE IF EXISTS user; 

CREATE TABLE IF NOT EXISTS user 
  ( 
     id           INT PRIMARY KEY auto_increment, 
     email        VARCHAR(25) UNIQUE NOT NULL, 
     password     CHAR(60) NOT NULL, 
     nickname     VARCHAR(50) NOT NULL,
     profile      TEXT NOT NULL,
     photo_link   VARCHAR(50) NOT NULL,
     role         ENUM('Admin', 'Member', 'User') DEFAULT 'User',
     created_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	   update_time  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
  );