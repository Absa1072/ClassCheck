const db = require('mysql2');

const connection = db.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'classcheck'
});

module.exports = connection;
