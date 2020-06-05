const express = require("express");
const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const route = express.Router();

route.get("/", function (req, res) {
  if (!req.cookies) {
    res.cookie("adminid", "");
  }
  res.render("login", { title: "Login", value: req.cookies });
});

async function Remember(req, res, next) {
  const { username, password, remember } = req.body;

  const [rows, rows2] = await Promise.all([adminModel.all(), userModel.all()]);
  const usernameAdmin = rows[0].username;
  const passwordAdmin = rows[0].password;
  const adminID = rows[0].adminid;

  let userid = "";

  let checkUser = false;
  let checkAdmin = false;

  for (let i = 0; i < rows2.length; i++) {
    let isEqualUserPassword = await bcrypt.compare(password, rows2[0].password);

    if (username === rows2[i].name && isEqualUserPassword) {
      checkUser = true;
      userid = rows2[i].userid;
      break;
    }
  }

  const isEqualAdminPassword = await bcrypt.compare(password, passwordAdmin);

  if (username === usernameAdmin && isEqualAdminPassword) {
    checkAdmin = true;
  }

  if (!checkUser && !checkAdmin) {
    res.cookie("adminid", "");
    res.header.adminid = "";
    res.cookie("userid", "");
    res.header.userid = "";
    return res.send("Wrong username  or password");
  } else if (checkUser) {
    if (remember === "on") {
      res.cookie("userid", userid);
    } else {
      res.clearCookie("userid");
      res.header.userid = userid;
    }
    res.clearCookie("adminid");
  } else if (checkAdmin) {
    if (remember === "on") {
      res.cookie("adminid", adminID);
    } else {
      res.clearCookie("adminid");
      res.header.adminid = adminID;
    }
    res.clearCookie("userid");
  }

  next();
}

route.post("/postLogin", Remember, function (req, res) {
  res.redirect("/");
});

module.exports = route;
