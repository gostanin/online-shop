const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'nodejs',
    database: 'node-complete',
    password: 'nodejspassword'
});

module.exports = pool.promise();