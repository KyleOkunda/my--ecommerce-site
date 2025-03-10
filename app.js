const express = require("express");
const session = require("express-session");
const ejs = require("ejs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const signedOutRoutes = require("./routes/signedout.js");
const signedInRoutes = require("./routes/signedin.js");

const app = express();
app.listen(process.env.PORT || 3001);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "mylittlesecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(signedOutRoutes);
app.use(signedInRoutes);
