const express = require("express");
const configModel = require("../models/config.model");
const mettingModel = require("../models/metting.model");

const route = express.Router();

route.get("/", async function (req, res) {
  const data = await configModel.all();
  const listMetting = await mettingModel.loadAscTime();
  const homeContent = data[0].homecontent;

  console.log(listMetting);
  res.render("home", {
    title: "Home",
    homeContent,
    listMetting,
  });
});

module.exports = route;
