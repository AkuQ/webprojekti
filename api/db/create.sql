CREATE DATABASE IF NOT EXISTS CalendarDemo;

CREATE USER 'CalendarDemo'@'localhost' IDENTIFIED BY 'password1';

GRANT ALL PRIVILEGES ON CalendarDemo.* TO 'CalendarDemo'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE CalendarDemo;

CREATE TABLE calendar_notes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(64) NOT NULL,
  description VARCHAR(512) DEFAULT "",
  date DATE NOT NULL,

  PRIMARY KEY (id)
);
