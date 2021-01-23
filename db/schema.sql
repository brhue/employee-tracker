drop database if exists employeeManagerDB;

create database employeeManagerDB;

use employeeManagerDB;

create table department (
	id int auto_increment primary key,
    name varchar(30)
);

create table role (
	id int auto_increment primary key,
    title varchar(30),
    salary decimal,
    department_id int,
    foreign key (department_id) references  department(id) on delete set null
);

create table employee (
	id int auto_increment primary key,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    foreign key (role_id) references role(id) on delete set null,
    foreign key (manager_id) references employee(id) on delete set null
);