const express = require("express");
const JsonData = require("../listUser.json");
const adminModel = require("../models/admin.model");
const userModel = require("../models/user.model");
const mettingModel = require("../models/metting.model");
const mettingDetailModel = require("../models/mettingdetail.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "./public/images" });

const route = express.Router();

route.get("/", function (req, res) {
  res.render("admin/home", {
    title: "Home",
    layout: "mainAdmin",
  });
});

route.get("/admin", async function (req, res) {
  const data = await userModel.all();

  res.render("admin/list", {
    title: "List User",
    layout: "mainAdmin",
    data,
  });
});

route.get("/config", function (req, res) {
  res.render("admin/config", {
    title: "Config",
    layout: "mainAdmin",
  });
});

route.post("/config", function (req, res) {
  const { homeContent, resJoin, resNotJoin } = req.body;

  fs.readFile("configContent.json", "utf8", function readFileCallback(
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      let obj = JSON.parse(data);
      let value = {
        homeContent,
        resJoin,
        resNotJoin,
      };
      obj = value;
      let json = JSON.stringify(obj);
      fs.writeFile("configContent.json", json, "utf8", (err) => {
        if (err) {
          throw err;
        } else {
          console.log("Success!");
        }
      });
    }
  });

  res.redirect("/admin");
});

route.get("/profile", async function (req, res) {
  const rows = await adminModel.all();
  const { fullname, username, email, phone, adminid } = rows[0];

  res.render("admin/profile", {
    title: "Profile",
    layout: "mainAdmin",
    adminid,
    fullname,
    username,
    email,
    phone,
  });
});

route.post("/profile", upload.single("avatar"), async function (req, res) {
  const { fullname, email, phone, username, password, adminid } = req.body;
  let avatar = "";
  if (req.file) {
    avatar = req.file.path.split("/").slice(1).join("/");
  }

  let entity;

  if (password) {
    //hash password
    let hashPassword = await bcrypt.hash(password, saltRounds);

    entity = {
      adminid,
      fullname,
      email,
      phone,
      username,
      password: hashPassword,
      avatar,
    };
  } else {
    entity = {
      adminid,
      fullname,
      email,
      phone,
      username,
      avatar,
    };
  }

  adminModel
    .update(entity)
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => {
      throw err;
    });
});

route.get("/mettings", async function (req, res) {
  const data = await mettingModel.all();

  data.map((item) => {
    let date = `0${item.time.getDate()}`.slice(-2);
    let month = `0${item.time.getMonth() + 1}`.slice(-2);
    let year = `${item.time.getFullYear()}`;
    item.time = `${date}/${month}/${year}`;
  });

  res.render("admin/listmetting", {
    title: "List Metting",
    layout: "mainAdmin",
    data,
  });
});

route.get("/mettings/edit/:id", async function (req, res) {
  const mettingId = req.params.id;
  const data = await mettingModel.loadWithId(mettingId);

  let date = `0${data[0].time.getDate()}`.slice(-2);
  let month = `0${data[0].time.getMonth() + 1}`.slice(-2);
  let year = `${data[0].time.getFullYear()}`;
  data[0].time = `${date}/${month}/${year}`;

  console.log(data);
  res.render("admin/editmetting", {
    title: "Edit",
    layout: "mainAdmin",
    data: data[0],
  });
});

route.post("/mettings/edit/:id", async function (req, res) {
  const entity = req.body;

  let date = entity.time.split("/")[0];
  let month = entity.time.split("/")[1];
  let year = entity.time.split("/")[2];

  entity.time = `${year}-${month}-${date}`;

  mettingModel
    .update(entity)
    .then((result) => {
      res.redirect("/admin/mettings");
    })
    .catch((err) => {
      throw err;
    });
});

route.get("/mettings/show/:id", async function (req, res) {
  const mettingid = req.params.id;
  const data = await mettingDetailModel.loadWithId(mettingid);

  res.render("admin/showmetting", {
    title: "Show Metting",
    layout: "mainAdmin",
    mettingid,
    data,
  });
});

module.exports = route;
