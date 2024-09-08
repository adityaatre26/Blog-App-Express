const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrat = require("passport-local");
const User = require("./models/users.js");

app.use(methodOverride("_method"));
const seshConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(seshConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const blogRoutes = require("./routes/blogRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use("/blogs", blogRoutes);
app.use("/", userRoutes);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Blog-App");
  console.log("Connection Initiated");
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection errror"));
db.once("open", () => {
  console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.listen(3000, () => {
  console.log("Server starting on port 3000");
});
