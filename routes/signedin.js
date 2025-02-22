const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const mysql = require("mysql2/promise");

const router = express.Router();

globalThis.signedIn = true;

router.get("/KyleAdmin", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results] = await connection.query("select * from products");
    const [customers] = await connection.query("select * from customers");
    res.render("admin", { results, customers });
  }
  main();
});

router.get("/:username", (req, res, next) => {
  let username = req.params.username;

  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    try {
      const [results] = await connection.query("select * from products");

      res.render("signedInIndex", {
        username,
        results,
        title: username,
      });
    } catch (err) {
      console.log(err);
    }
  }
  main();
});

router.get("/:username/cart", (req, res) => {
  let username = req.params.username;
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    const [results, field] = await connection.query(
      "select * from cart where username = ?",
      [username]
    );

    res.render("cart", { results, title: "Shopping Cart" });
  }
  main();
});

router.post("/:username/cart", (req, res) => {
  let username = req.params.username;
  let data = req.body;
  console.log(data);
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    await connection.query("insert into cart() values(?,?, ?, ?, ?, ?)", [
      username,
      data.prodid,
      data.prodName,
      data.imageLoc,
      data.price,
      data.quantity,
    ]);
  }
  main();
});

router.delete("/:username/cart", (req, res) => {
  let username = req.params.username;
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    await connection.query(
      "delete from cart where username = ? and productId = ?",
      [username, req.body.id]
    );
    res.json({ redirect: `/${username}/cart` });
  }
  main();
});

router.get("/:username/:prodid", (req, res, next) => {
  let username = req.params.username;
  let prodid = req.params.prodid;

  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    try {
      const [results] = await connection.execute(
        "select * from products where productId = ?",
        [prodid]
      );
      console.log(results);
      res.render("signedInProducts", { results });
    } catch (err) {
      console.log(err);
    }
  }
  main();
});

module.exports = router;
