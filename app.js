const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const app = express();
app.listen(3001);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
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

    res.render("index", { results, title: "All you can buy" });
  }

  main();
});

app.get("/signUp", (req, res) => {
  res.render("signup");
});

app.get("/signIn", (req, res) => {
  res.render("signin");
});

app.post("/signUp", (req, res) => {
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

app.post("/signIn", (req, res) => {
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
        let isMatch = await bcrypt.compare(req.body.password, hashedPassword);
        if (isMatch) {
          res.json({ resmessage: "Access granted" });
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
