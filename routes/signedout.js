const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");

const router = express.Router();

router.get("/", (req, res) => {
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

router.get("/signUp", (req, res) => {
  res.render("signup");
});

router.get("/signIn", (req, res) => {
  res.render("signin");
});

router.post("/signUp", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    let hashedPassword = await bcrypt.hash(req.body.password, 12);

    try {
      const [isEmailExist] = await connection.query(
        "select case when exists(select 1 from customers where email = ?) then 'true' else 'false' end as emailExists",
        [req.body.email]
      );

      if (isEmailExist[0].emailExists == "false") {
        await connection.query(
          "insert into customers(username, email, cust_password) value(?, ?, ?)",
          [req.body.username, req.body.email, hashedPassword]
        );

        res.json({
          resmessage:
            "Successfully signed in, please log in with your credentials",
        });
      } else {
        res.json({ resmessage: "Account already exists!" });
      }
    } catch (err) {
      console.log(err.sqlMessage);
    }
  }
  main();
});

router.post("/signIn", (req, res) => {
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    try {
      const [isEmailExist] = await connection.query(
        "select case when exists(select email from customers where email = ? or username = ?) then 'true' else 'false' end as emailExist ",
        [req.body.username, req.body.username]
      );

      if (isEmailExist[0].emailExist == "false") {
        res.json({
          resmessage:
            "Account does not exist, please sign up to create account.",
        });
      } else {
        const [results] = await connection.query(
          "select * from customers where email = ? or username = ?",
          [req.body.username, req.body.username]
        );

        let hashedPassword = results[0].cust_password;
        let username = results[0].username;
        let isMatch = await bcrypt.compare(req.body.password, hashedPassword);
        if (isMatch) {
          res.json({ resmessage: "Access granted", username });
        } else {
          res.json({ resmessage: "Incorrect password" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  main();
});

router.get("/cart", (req, res) => {
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

router.post("/cart", (req, res) => {
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

router.delete("/cart", (req, res) => {
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

router.get("/:prodid", (req, res, next) => {
  let prodid = req.params.prodid;

  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });
    try {
      const [results, field] = await connection.query(
        "select * from products where productId = ?",
        [prodid]
      );

      res.render("productspage", { result: results[0] });
    } catch (err) {
      next();
    }
  }
  main();
});

module.exports = router;
