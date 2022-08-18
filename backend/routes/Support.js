var express = require("express");
var router = express.Router();
const { Support } = require("../Database/database.js");
const supportController = require('../Controller/Support.js');

/* GET Support listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create Support Routes

router.post('/create', supportController.createSupport);
router.delete('/delete/:supportId', supportController.deleteSupport);
router.get('/all-Support', supportController.allSupport);
router.get('/one-Support/:supportId', supportController.oneSupport);



module.exports = router;
