const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool({
  connectionLimit: 10,
  ...config,
});

pool.query(`CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(100) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  project_title VARCHAR(50),
  email VARCHAR(50),
  phone_number INT,
  time_slot INT,
  PRIMARY KEY (id)
)`, (error) => {
  if (error) {
    console.error(error);
  }
});

pool.query(`CREATE TABLE IF NOT EXISTS time_slots (
  id INT NOT NULL AUTO_INCREMENT,
  date CHAR(10),
  start_time CHAR(8),
  end_time CHAR(8),
  available_seats INT,
  PRIMARY KEY (id)
)`, (error) => {
  if (error) {
    console.error(error);
  }
});

module.exports = pool;
