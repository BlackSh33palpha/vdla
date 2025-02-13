const mysql = require('mysql2');

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'webapp_db'
});

// Connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

module.exports = db;
