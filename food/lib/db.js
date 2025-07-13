import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '',
  port: ,
  user: '',
  password: '',
  database: 'foods',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
  },
});

export default db;
