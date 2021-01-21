const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeManagerDB'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected!');
  // createDepartment();
  // createRole();
  // createEmployee();
  // viewDepartments();
  // viewRoles();
  viewEmployees();
});

function createDepartment() {
  connection.query('insert into department (name) values (?)', ['Engineering'], (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

function viewDepartments() {
  connection.query('select * from department', (err, rows) => {
    if (err) throw err;
    console.table(rows);
    connection.end();
  });
}

function createRole() {
  connection.query('select * from department', (err, rows) => {
    if (err) throw err;
    if (rows.length === 0) {
      console.log('You need to create some departments first!');
      connection.end();
    } else {
      const values = ['Lead Engineer', 200000, 1];
      connection.query('insert into role (title, salary, department_id) values (?, ?, ?)', values, (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
      });
    }
  });
}

function viewRoles() {
  connection.query('select * from role', (err, rows) => {
    if (err) throw err;
    console.table(rows);
    connection.end();
  });
}

function createEmployee() {
  connection.query('select * from role', (err, rows) => {
    if (err) throw err;
    if (rows.length === 0) {
      console.log('You need to create some roles first!');
      connection.end();
    } else {
      const values = ['Bradley', 'Donahue', 1];
      connection.query('insert into employee (first_name, last_name, role_id) values (?, ?, ?)', values, (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
      });
    }
  });
}

function viewEmployees() {
  connection.query('select * from employee', (err, rows) => {
    if (err) throw err;
    console.table(rows);
    connection.end();
  });
}