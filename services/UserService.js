const { connection } = require('../db');
const { queryAsync } = connection;
class UserService {
    getUserById(userId) {
        const sql = `SELECT * FROM users WHERE id =${userId}`;
        return queryAsync(sql)
            .then((result) => result[0])
            .catch((error) => console.log('error from promisify', error));
    }
    insertUserInDb(name, email, password) {
        const sql = 'INSERT INTO users SET ?';
        return queryAsync(sql, { name, email, password })
            .then(() => console.log('user added'))
            .catch((error) => console.log('error from insertUserInDb:', error));
    }
    getEmail(email) {
        const sql = 'SELECT email FROM users WHERE email=?';
        return queryAsync(sql, [email])
            .then((result) => result)
            .catch((error) => console.log(error));
    }
    getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE  email = ?';
        return queryAsync(sql, [email])
            .then((result) => result)
            .catch((error) => console.log(error));
    }
}

module.exports = UserService;
