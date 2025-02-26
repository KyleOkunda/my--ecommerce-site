const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const mysql = require("mysql2/promise");

const router = express.Router();

router.get("/KyleAdmin", (req, res) => {
  if (req.session.user.username == "KyleAdmin") {
    main();
  } else {
    res.render("404");
  }

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
});

router.get("/:username", (req, res, next) => {
  let username = req.params.username;

  if (username == req.session.user.username) {
    console.log(req.session);
    main();
  } else {
    res.render("404");
  }

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
});

router.post("/:username", (req, res) => {
  globalThis.signedIn = false;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });

  res.json({ redirect: "/" });
});

router.get("/:username/cart", (req, res) => {
  let username = req.params.username;
  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }
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
});

router.post("/:username/cart", (req, res) => {
  let username = req.params.username;
  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }
  async function main() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "ecommerce",
      password: "KyleMuse@08",
    });

    await connection.query("delete from cart where username = ?", [username]);

    let itemsArray = req.body.itemsArray;
    let quantityArray = req.body.quantityArray;
    var counter = 0;

    itemsArray.forEach((element) => {
      (async () => {
        const [results] = await connection.query(
          "select no_remaining from products where productId = ?",
          [element]
        );

        let difference = results[0].no_remaining - quantityArray[counter];
        counter++;

        await connection.query(
          "update products set no_remaining = ? where productId = ?",
          [difference, element]
        );
      })();
    });
  }
});
router.post("/:username/:prodid", (req, res) => {
  let username = req.params.username;
  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }

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
});

router.delete("/:username/cart", (req, res) => {
  let username = req.params.username;
  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }

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
});

router.get("/:username/:prodid", (req, res, next) => {
  let username = req.params.username;
  let prodid = req.params.prodid;

  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }

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
});

module.exports = router;
