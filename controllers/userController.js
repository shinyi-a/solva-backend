const express = require("express");
const app = express();
const User = require("../models/userModel");
const methodOverride = require("method-override");
const jwt = require("jsonwebtoken");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// Seed data
// const usersSeed = require("./userSeed");
// app.get("/seed", async (req, res) => {
//   try {
//     const seedUsers = await User.create(usersSeed);
//     res.send(seedUsers);
//   } catch (err) {
//     res.send(err.message);
//   }
// });

//make new users
app.post("/", async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.create(req.body);
    // console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error.message);
  }
});

//get all auditors
app.get("/auditor", async (req, res) => {
  console.log("User Controller: Trying to get users");
  // console.log(req.context);
  try {
    const users = await User.find({ usertype: "Auditor" });
    // console.log(users);
    res.send(users);
  } catch (err) {
    res.status(500).send("Unexpected error has occured while retreiving users");
    return;
  }
});

//get all users, staff and auditors
app.get("/all", async (req, res) => {
  console.log("User Controller: Trying to get users");
  // console.log(req.context);
  try {
    const users = await User.find();
    // console.log(users);
    res.send(users);
  } catch (err) {
    res.status(500).send("Unexpected error has occured while retreiving users");
    return;
  }
});

//view individual user
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.send(user);
});

//delete users
app.delete("/:id", async (req, res) => {
  // const { id } = req.params;
  // try {
  console.log("User Controller: Trying to delete an user");
  const user = await User.findOneAndDelete({ _id: req.params.id });
  res.send(user);
  // } catch (error) {
  //   console.log("Delete User Controller Error: " + error.message);
  // }
});

//verify jwt
app.use((req, res, next) => {
  console.log("UserController: Middleware Check Activated");
  console.log("Request Information: ", req.headers.token);
  if (!req.headers.token) {
    res.status(401).send("Unauthenticated,no token, Please Login");
    return;
  }
  try {
    const payload = jwt.verify(req.headers.token, process.env.SECRET);
    console.log("current payload", payload);
    if (payload.role !== "Staff" || payload.role !== "Admin") {
      console.log("UserController.js: User is not admin");
      res.status(401).send("User is not admin, Unauthourized users");
      return;
    }
    req.context = payload;
    next();
  } catch (err) {
    console.log("error message caught in user controller: ", err);
    res.status(401).send("Expired or Invalid Token, Please Login");
    return;
  }
});

//update user - stretch goal, to allow admin to change project manager
// app.put("/:id", async (req, res) => {
//   const user = await User.updateOne({ _id: req.params.id }, req.body, {
//     new: true,
//   });
//   res.send(user);
// });

module.exports = app;
