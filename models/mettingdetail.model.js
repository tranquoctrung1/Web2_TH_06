const db = require("../utils/db");

const TBL_METTINGDETAIL = "mettingdetail";

module.exports.all = function () {
  return db.load(`select * from ${TBL_METTINGDETAIL}`);
};

module.exports.loadWithId = function (id) {
  return db.load(
    `select userid from ${TBL_METTINGDETAIL} where mettingid = '${id}'`
  );
};

module.exports.loadWithUserId = function (id) {
  return db.load(
    `select mettingid from ${TBL_METTINGDETAIL} where userid = '${id}'`
  );
};

module.exports.add = function (entity) {
  return db.add(TBL_METTINGDETAIL, entity);
};

module.exports.update = function (entity) {
  const condition = {
    mettingdetailid: entity.mettingdetailid,
  };

  delete entity.mettingdetailid;
  return db.patch(TBL_METTINGDETAIL, entity, condition);
};
