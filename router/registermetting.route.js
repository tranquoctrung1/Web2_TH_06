const express = require("express");
const fs = require("fs");
const mettingModel = require("../models/metting.model");
const mettingDetailModel = require("../models/mettingdetail.model");

const route = express.Router();

route.get("/", async function (req, res) {
  if (res.header.userid || req.cookies.userid) {
    const data = await mettingModel.loadNoHelped();
    res.render("registermettings", {
      title: "Register Mettings",
      data,
    });
  } else {
    return res.redirect("/login");
  }
});

route.post("/", async function (req, res) {
  const userid = req.cookies.userid || res.header.userid;
  const { mettingid } = req.body;

  const rows = await mettingDetailModel.all();

  // create new metting detail id
  let newMettingDeailId = "";
  if (rows.length != 0) {
    newMettingDeailId =
      "md" +
      (parseInt(rows[rows.length - 1].mettingdetailid.match(/(\d+)/)[0]) + 1);
  } else {
    newMettingDeailId = "md1";
  }

  const entity = {
    mettingdetailid: newMettingDeailId,
    mettingid,
    userid,
  };

  mettingDetailModel
    .add(entity)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = route;
