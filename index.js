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
        viewEmployees();
        break;
      case 1:
        viewRoles();
        break;
      case 2:
        viewDepartments();
        break;
      case 3:
        await createEmployee();
        break;
      case 4:
        createRole();
        break;
      case 5:
        createDepartment();
        break;
      case 6:
        editEmployeeRole();
        break;
      default:
        // shouldn't be hit
    }
  } catch (e) {
    console.error(e);
    connection.end();
  }
  start();
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

function getRoles() {
  return new Promise((resolve, reject) => {
    connection.query('select * from role', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function createEmployee() {
  const employees = (await getEmployees()).map((employee) => ({ value: employee.id, name: `${employee.first_name} ${employee.last_name}` }));
  employees.push({ name: 'None', value: null });
  const roles = (await getRoles()).map(({ id: value, title: name }) => ({ value, name }));;
  if (roles.length === 0) {
    console.log('You need to add some roles first!');
    return;
  }
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'first_name'
    },
    {
      type: 'input',
      message: "What is the employee's last name?",
      name: 'last_name',
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      choices: roles,
      name: 'role_id',
      when: () => roles.length > 0,
    },
    {
      type: 'list',
      message: "Who is the employee's manager?",
      choices: employees,
      name: 'manager_id',
      when: () => employees.length > 0
    }
  ]);
  console.log(answers);
  connection.query('insert into employee set ?', answers, (err, res) => {
    if (err) throw err;
    console.log(res);
    // connection.end();
  });
}

function viewEmployees() {
  connection.query('select * from employee', (err, rows) => {
    if (err) throw err;
    console.table(rows);
    connection.end();
  });
}

function getEmployees() {
  return new Promise((resolve, reject) => {
    connection.query('select * from employee', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
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
