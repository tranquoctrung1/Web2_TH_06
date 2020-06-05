const express = require("express");
const mettingDetailModel = require("../models/mettingdetail.model");

const route = express.Router();

route.get("/", async function (req, res) {
  if (res.header.userid || req.cookies.userid) {
    const userid = res.header.userid || req.cookies.userid;

    const data = await mettingDetailModel.loadWithUserId(userid);

    res.render("listmetting", {
      title: "List Mettings",
      data,
    });
  } else {
    return res.redirect("/login");
  }
});

module.exports = route;
