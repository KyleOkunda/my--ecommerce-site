const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");

const app = express();
app.listen(3001);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

var signIn = false;
app.use((req, res) => {
  signIn = true;
  console.log(signIn);
});

app.get("/", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results, field] = await connection.query("select * from products");

    res.render("index", { results, title: "All you can buy" });
  }

  main();
});

app.get("/cart", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results, field] = await connection.query("select * from cart");

    res.render("cart", { results, title: "Shopping Cart" });
  }
  main();
});

app.post("/cart", (req, res) => {
  let data = req.body;
  console.log(data);
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    await connection.query("insert into cart() values(?, ?, ?, ?, ?)", [
      data.prodid,
      data.prodName,
      data.imageLoc,
      data.price,
      data.quantity,
    ]);
  }
  main();
});

app.delete("/cart", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    await connection.query("delete from cart where productId = ?", [
      req.body.id,
    ]);
    res.json({ redirect: "/cart" });
  }
  main();
});

app.get("/:prodid", (req, res) => {
  let prodid = req.params.prodid;

  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results, field] = await connection.query(
      "select * from products where productId = ?",
      [prodid]
    );

    res.render("productspage", { result: results[0] });
  }
  main();
});
