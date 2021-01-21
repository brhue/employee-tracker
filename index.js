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
  // viewEmployees();
  // editEmployeeRole();
  // editEmployeeManager();
  start();
});

async function start() {
  const choices = [
    {
      name: 'View All Employees',
      value: 0,
    },
    {
      name: 'View All Roles',
      value: 1,
    },
    {
      name: 'View All Departments',
      value: 2,
    },
    {
      name: 'Add Employee',
      value: 3,
    },
    {
      name: 'Add Role',
      value: 4,
    },
    {
      name: 'Add Department',
      value: 5,
    },
    {
      name: 'Update Employee Role',
      value: 6,
    },
  ];
  const questions = [
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'choice',
      choices,
    },
  ];

  try {
    const { choice } = await inquirer.prompt(questions);
    switch (choice) {
      case 0:
        return viewEmployees();
      case 1:
        return viewRoles();
      case 2:
        return viewDepartments();
      case 3:
        return createEmployee();
      case 4:
        return createRole();
      case 5:
        return createDepartment();
      case 6:
        return editEmployeeRole();
      default:
        // shouldn't be hit
    }
  } catch (e) {
    console.error(e);
    connection.end();
  }
}

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

function editEmployeeRole() {
  const values = [1, 1];
  connection.query('update employee set role_id = ? where id = ?', values, (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

function editEmployeeManager() {
  const values = [1, 1];
  connection.query('update employee set manager_id = ? where id = ?', values, (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}
