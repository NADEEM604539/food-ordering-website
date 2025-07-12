import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'gateway01.us-west-2.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3heehgnHZK8CDig.root',
  password: 'UpVM7wD5oYDeZN7z',
  database: 'foods',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
  },
});

export default db;
