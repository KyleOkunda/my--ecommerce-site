const mysql = require("mysql2/promise");
require("dotenv").config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });

  return connection;
}

async function exportConnection() {
  const newConnection = await main();
  return newConnection;
}
module.exports = exportConnection();
