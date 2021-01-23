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

module.exports = {
  connection,
  getAll,
  updateOneById,
  createOne,
};
