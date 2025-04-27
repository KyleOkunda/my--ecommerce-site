const express = require("express");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const connectionPromise = require("./connection");

const router = express.Router();

router.get("/KyleAdmin", (req, res) => {
  if (req.session.user.username == "KyleAdmin") {
    main();
  } else {
    res.render("404");
  }

  async function main() {
    const connection = await connectionPromise;
    const [results] = await connection.query("select * from products");
    const [customers] = await connection.query("select * from customers");
    const [orders] = await connection.query("select * from orders");
    res.render("admin", { results, customers, orders });
  }
});

router.post("/KyleAdmin", upload.single("image"), (req, res) => {
  console.log("Post req made");
  console.log(req.body);
  console.log(req.file);
});

router.get("/:username", (req, res, next) => {
  let username = req.params.username;

  if (username == req.session.user.username) {
    main();
  } else {
    res.render("404");
  }

  async function main() {
    try {
      const connection = await connectionPromise;
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
    const connection = await connectionPromise;
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
    const connection = await connectionPromise;
    await connection.query(
      "insert into orders select * from cart where username = ?",
      [username]
    );
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

  async function main() {
    const connection = await connectionPromise;
    let total = data.price * data.quantity;
    await connection.query("insert into cart() values(?,?, ?, ?, ?, ?, ?)", [
      username,
      data.prodid,
      data.prodName,
      data.imageLoc,
      data.price,
      data.quantity,
      total,
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
    const connection = await connectionPromise;
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
    const connection = await connectionPromise;
    try {
      const [results] = await connection.execute(
        "select * from products where productId = ?",
        [prodid]
      );

      res.render("signedInProducts", { results });
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
