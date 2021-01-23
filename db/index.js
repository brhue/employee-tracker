const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeManagerDB',
});

function getAll(table) {
  return new Promise((resolve, reject) => {
    connection.query('select * from ??', table, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function updateOneById(table, id, values) {
  return new Promise((resolve, reject) => {
    connection.query('update ?? set ? where id = ?', [table, values, id], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function createOne(table, values) {
  return new Promise((resolve, reject) => {
    connection.query('insert into ?? set ?', [table, values], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getEmployeesWithJoins() {
  const queryStr = `select employee.first_name, employee.last_name, title, salary, name as department, concat(manager.first_name, ' ', manager.last_name) as manager from employee
  left join employee as manager on employee.manager_id = manager.id
  join role on employee.role_id = role.id
  join department on department_id = department.id;`;
  return new Promise((resolve, reject) => {
    connection.query(queryStr, (err, employees) => {
      if (err) {
        reject(err);
      } else {
        resolve(employees);
      }
    });
  });
}

function getRolesWithJoin() {
  const queryStr = `select title, salary, name as department from role
  join department on department_id = department.id;`;
  return new Promise((resolve, reject) => {
    connection.query(queryStr, (err, roles) => {
      if (err) {
        reject(err);
      } else {
        resolve(roles);
      }
    });
  });
}

function getBudget() {
  const queryStr = `select name as department, sum(salary) as budget from employee 
  join role on role_id = role.id
  join department on department_id = department.id
  group by department;`;

  return new Promise((resolve, reject) => {
    connection.query(queryStr, (err, budgets) => {
      if (err) {
        reject(err);
      } else {
        resolve(budgets);
      }
    });
  });
}

module.exports = {
  connection,
  getAll,
  updateOneById,
  createOne,
  getEmployeesWithJoins,
  getRolesWithJoin,
  getBudget,
};
