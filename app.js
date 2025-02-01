const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");

const app = express();
app.listen(3001);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results, field] = await connection.query("select * from products");
    console.log(results);

    res.render("index", { results });
  }

  main();
});
