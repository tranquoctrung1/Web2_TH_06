const db = require("../utils/db");

const TBL_METTING = "metting";

module.exports.all = function () {
  return db.load(`select * from ${TBL_METTING}`);
};

module.exports.loadWithId = function (id) {
  return db.load(`select * from ${TBL_METTING} where mettingid = '${id}'`);
};

module.exports.loadNoHelped = function () {
  return db.load(`select * from ${TBL_METTING} where ishelped = 0`);
};

module.exports.loadAscTime = function () {
  return db.load(`select * from ${TBL_METTING} order by time asc`);
};

module.exports.update = function (entity) {
  const condition = {
    mettingid: entity.mettingid,
  };

  delete entity.mettingid;
  return db.patch(TBL_METTING, entity, condition);
};
