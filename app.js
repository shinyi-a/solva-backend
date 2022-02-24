const express = require("express");
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");
const app = express();

const cors = require("cors");
const CORS_WHITELIST = process.env.CORS_WHITELIST.split(",");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  cors({
    origin: CORS_WHITELIST,
  })
);

const blockController = require("./controllers/blockController");
const userController = require("./controllers/userController");
const sessionController = require("./controllers/sessionController");

app.use("/block", blockController);
app.use("/user", userController);
app.use("/sessions", sessionController);

module.exports = app;
