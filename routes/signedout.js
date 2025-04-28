const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const connectionPromise = require("./connection");

const router = express.Router();

router.get("/", (req, res) => {
  async function main() {
    const connection = await connectionPromise;
    const [results] = await connection.query("select * from products");

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
    const connection = await connectionPromise;
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
    const connection = await connectionPromise;
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
          req.session.user = {
            username,
            userEmail: results[0].email,
          };
          //console.log(req.session);

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

router.get("/favicon.ico", (req, res) => {
  res.sendStatus(204); // Respond with "No Content"
});

router.get("/:prodid", (req, res, next) => {
  let prodid = req.params.prodid;
  console.log(prodid);

  if (isNaN(prodid)) {
    next();
  } else {
    try {
      main();
    } catch (err) {
      res.render("404");
    }
    async function main() {
      const connection = await connectionPromise;
      const [results] = await connection.query(
        "select * from products where productId = ?",
        [prodid]
      );
      if (results.length < 1) {
        res.render("404");
      } else {
        res.render("productspage", { results });
      }
    }
  }
});

module.exports = router;
