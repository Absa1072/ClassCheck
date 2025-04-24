const db = require('mysql2');

const connection = db.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'M@ster0f@ll', 
  database: 'classcheck'
});

module.exports = connection;
