const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const signedOutRoutes = require("./routes/signedout.js");

const app = express();
app.listen(3001);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(signedOutRoutes);
