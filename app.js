const express = require("express");
const session = require("express-session");

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
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(signedOutRoutes);
app.use(signedInRoutes);
