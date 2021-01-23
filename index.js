const { connection, getAll, updateOneById, createOne } = require('./db');
const inquirer = require('inquirer');

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
        await viewEmployees();
        break;
      case 1:
        await viewRoles();
        break;
      case 2:
        await viewDepartments();
        break;
      case 3:
        await createEmployee();
        break;
      case 4:
        await createRole();
        break;
      case 5:
        await createDepartment();
        break;
      case 6:
        await editEmployeeRole();
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

async function createDepartment() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'name',
    },
  ]);
  const result = await createOne('department', answers);
  console.log(`Created '${answers.name}' successfully.`);
}

async function viewDepartments() {
  const departments = await getAll('department');
  console.table(departments);
}

async function createRole() {
  const departments = (await getAll('department')).map((department) => ({ value: department.id, name: department.name }));
  if (departments.length === 0) {
    console.log('You need to add some deparments first!');
    return;
  }
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the role?',
      name: 'title',
    },
    {
      type: 'number',
      message: "What is this role's salary?",
      name: 'salary',
    },
    {
      type: 'list',
      message: 'What department does this role belong too?',
      choices: departments,
      name: 'department_id',
    }
  ]);
  const result = await createOne('role', answers);
  console.log(`Created '${answers.title}' successfully.`);
}

async function viewRoles() {
  const roles = await getAll('role');
  console.table(roles);
}

async function createEmployee() {
  const employees = (await getAll('employee')).map((employee) => ({ value: employee.id, name: `${employee.first_name} ${employee.last_name}` }));
  employees.push({ name: 'None', value: null });
  const roles = (await getAll('role')).map(({ id: value, title: name }) => ({ value, name }));;
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
  const result = await createOne('employee', answers);
  console.log(`Created '${answers.first_name} ${answers.last_name}' successfully.`);
}

async function viewEmployees() {
  const employees = await getAll('employee');
  console.table(employees);
}

async function editEmployeeRole() {
  const employees = (await getAll('employee')).map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
  const roles = (await getAll('role')).map((role) => ({ name: role.title, value: role.id }));
  const { id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      choices: employees,
      message: 'Whose role would you like to update?',
      name: 'id',
    },
    {
      type: 'list',
      choices: roles,
      message: 'What is their new role?',
      name: 'role_id',
    }
  ]);
  const result = await updateOneById('employee', id, { role_id });
  console.log('Updated successfully!');
}

function editEmployeeManager() {
  const values = [1, 1];
  connection.query('update employee set manager_id = ? where id = ?', values, (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}
