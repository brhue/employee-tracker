const {
  connection,
  getAll,
  updateOneById,
  createOne,
  getEmployeesWithJoins,
  getRolesWithJoin,
  getBudget,
  deleteOne,
  getEmployeesByManagerID,
  getManagers,
} = require('./db');
const inquirer = require('inquirer');

connection.connect((err) => {
  if (err) throw err;
  console.log('Welcome to the Employee Manager CLI!');
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
    {
      name: 'Update Employee Manager',
      value: 7,
    },
    {
      name: 'View Budget',
      value: 8,
    },
    {
      name: 'Delete Department',
      value: 9,
    },
    {
      name: 'Delete Role',
      value: 10,
    },
    {
      name: 'Delete Employee',
      value: 11,
    },
    {
      name: 'View Employees By Manager',
      value: 12,
    },
    {
      name: 'Exit',
      value: 13,
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
      case 7:
        await editEmployeeManager();
        break;
      case 8:
        await viewBudget();
        break;
      case 9:
        await deleteDepartment();
        break;
      case 10:
        await deleteRole();
        break;
      case 11:
        await deleteEmployee();
        break;
      case 12:
        await viewEmployeesByManager();
        break;
      case 13:
        connection.end();
        console.log('Goodbye!');
        process.exit();
      default:
      // shouldn't be hit
    }
  } catch (e) {
    console.error(e);
    connection.end();
  }
  start();
}

async function viewBudget() {
  const budgets = await getBudget();
  console.table(budgets);
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

async function deleteDepartment() {
  const departments = (await getAll('department')).map((d) => ({ name: d.name, value: d.id }));
  if (departments.length === 0) {
    console.log('No departments to delete!');
    return;
  }
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Which department would you like to remove?',
      choices: departments,
      name: 'id',
    },
  ]);
  const result = await deleteOne('department', id);
  console.log('Deleted successfully!');
}

async function deleteRole() {
  const roles = (await getAll('role')).map((r) => ({ name: r.title, value: r.id }));
  if (roles.length === 0) {
    console.log('No roles to delete!');
    return;
  }
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Which role would you like to remove?',
      choices: roles,
      name: 'id',
    },
  ]);
  const result = await deleteOne('role', id);
  console.log('Deleted successfully!');
}

async function deleteEmployee() {
  const employees = (await getAll('employee')).map((e) => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }));
  if (employees.length === 0) {
    console.log('No employees to delete!');
    return;
  }
  const { id } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Which employee would you like to remove?',
      choices: employees,
      name: 'id',
    },
  ]);
  const result = await deleteOne('employee', id);
  console.log('Deleted successfully!');
}

async function viewDepartments() {
  const departments = await getAll('department');
  console.table(departments);
}

async function createRole() {
  const departments = (await getAll('department')).map((department) => ({
    value: department.id,
    name: department.name,
  }));
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
    },
  ]);
  const result = await createOne('role', answers);
  console.log(`Created '${answers.title}' successfully.`);
}

async function viewRoles() {
  const roles = await getRolesWithJoin();
  console.table(roles);
}

async function createEmployee() {
  const employees = (await getAll('employee')).map((employee) => ({
    value: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
  }));
  employees.push({ name: 'None', value: null });
  const roles = (await getAll('role')).map(({ id: value, title: name }) => ({ value, name }));
  if (roles.length === 0) {
    console.log('You need to add some roles first!');
    return;
  }
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'first_name',
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
      when: () => employees.length > 0,
    },
  ]);
  const result = await createOne('employee', answers);
  console.log(`Created '${answers.first_name} ${answers.last_name}' successfully.`);
}

async function viewEmployees() {
  const employees = await getEmployeesWithJoins();
  console.table(employees);
}

async function viewEmployeesByManager() {
  const managers = (await getManagers()).map((m) => ({ name: m.full_name, value: m.id }));
  if (managers.length === 0) {
    console.log('There are currently no managers!');
    return;
  }

  const { manager_id } = await inquirer.prompt([
    {
      type: 'list',
      message: "Which manager's employees would you like to see?",
      choices: managers,
      name: 'manager_id',
    },
  ]);

  const employees = await getEmployeesByManagerID(manager_id);
  console.table(employees);
}

async function editEmployeeRole() {
  const employees = (await getAll('employee')).map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
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
    },
  ]);
  const result = await updateOneById('employee', id, { role_id });
  console.log('Updated successfully!');
}

async function editEmployeeManager() {
  const employees = (await getAll('employee')).map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const { id, manager_id } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Whose manager would you like to update?',
      choices: employees,
      name: 'id',
    },
    {
      type: 'list',
      message: 'Who is their new manager?',
      choices: (answers) => employees.filter((e) => e.id !== answers.id),
      name: 'manager_id',
    },
  ]);
  const result = await updateOneById('employee', id, { manager_id });
  console.log('Updated successfully!');
}
