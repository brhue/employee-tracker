insert into department (name) values ('Engineering'), ('Sales'), ('Human Resources'), ('Marketing'), ('Legal');

insert into role (title, salary, department_id)
values ('Project Manager', 125000, 1), ('Senior Software Engineer', 150000, 1), ('Software Engineer', 120000, 1), ('Junior Software Engineer', 90000, 1),
('Sales Lead', 125000, 2), ('Junior Salesperson', 85000, 2), ('HR Manager', 85000, 3);

insert into employee (first_name, last_name, role_id, manager_id)
values ('John', 'Doe', 1, null), ('Jim', 'Doe', 2, 1), ('Jane', 'Doe', 3, 1), ('Jen', 'Doe', 4, 1),
('Mark', 'Brag', 5, null);
