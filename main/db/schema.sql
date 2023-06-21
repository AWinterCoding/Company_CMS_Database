DROP DATABASE IF EXISTS company_db;
CREATE DATABASE movies_db;

USE movie_db;

CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE roles(
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(50) NOT NULL,
    salary INT NOT NULL
);

CREATE TABLE employees(
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    manager VARCHAR(100)
);