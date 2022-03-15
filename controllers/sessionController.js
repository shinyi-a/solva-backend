const express = require("express");
const app = express();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      console.log("Session Controller: Invalid Email");
      return res.status(401).send({
        status: 401,
        message: "Invalid Email",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      console.log("Session Controller: Invalid Password");
      //unauthorised
      return res.status(401).send({
        status: 401,
        message: "Invalid Password",
      });
    }

    console.log("User is Log in: " + user);
    // encode jwt and send
    const token = jwt.sign(
      {
        sub: user.email,
        role: user.usertype,
        firstname: user.firstname,
        userid: user._id,
      },
      process.env.SECRET,
      { expiresIn: "1h", algorithm: "HS256" }
    );
    console.log("token generated:", token); //i think this is the refresh token
    return res.send({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Something broke!");
  }
});

module.exports = app;
