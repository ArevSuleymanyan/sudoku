const mysql = require('mysql');
const util = require('util');

function createConnection(host, user, password) {
    const connection = mysql.createConnection({
        host,
        user,
        password,
    });
    connection.connect((error) => {
        if (error) {
            console.log('ERROR: ' + error);
        } else {
            console.log('MySQL is connected...');
        }
    });
    connection.queryAsync = util.promisify(connection.query).bind(connection);
    connection.queryAsync('SHOW DATABASES LIKE ?', ['sudoku'])
      .then((result) => {
        if (result.length === 0) {
          // 'sudoku' database does not exist, create it
          return connection.queryAsync('CREATE DATABASE sudoku');
        }
      })
      .then(() => {
        // Switch to 'sudoku' database
        return connection.queryAsync('USE sudoku');
      })
      .then(() => {
        // Check if 'users' table exists
        return connection.queryAsync(
          "SHOW TABLES LIKE 'users'"
        );
      })
      .then((result) => {
        if (result.length === 0) {
          // 'users' table does not exist, create it
          const createUserTableSQL =
            'CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))';
          return connection.queryAsync(createUserTableSQL);
        }
      })
      .then(() => {
        // Check if 'game' table exists
        return connection.queryAsync(
          "SHOW TABLES LIKE 'game'"
        );
      })
      .then((result) => {
        if (result.length === 0) {
          // 'game' table does not exist, create it
          const createGameTableSQL =
            'CREATE TABLE game (user_id INT PRIMARY KEY, sudoku JSON)';
          return connection.queryAsync(createGameTableSQL);
        }
      })
      .then(() => {
        console.log('Database and tables check completed.');
      })
      .catch((error) => {
          console.error('Error during database check:', error);
      });

    return connection;
}
const connection = createConnection(
    process.env.HOST,
    process.env.USER,
    process.env.PASSWORD
);

connection.queryAsync = util.promisify(connection.query).bind(connection);
module.exports.createConnection = createConnection;
module.exports.connection = connection;
