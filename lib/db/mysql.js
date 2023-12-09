const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password:'rootroot' ,
    database: 'cms_db',
  },
  console.log(`Database is connected.`)
);

module.exports = db;
