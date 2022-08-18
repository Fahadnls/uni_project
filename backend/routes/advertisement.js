var express = require("express");
var router = express.Router();
const adsController = require('../Controller/advertisement');

/* GET ads listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create ads Routes

router.post('/create', adsController.createAds);
router.post('/update/:adId', adsController.updateAds);
router.delete('/del/:adId', adsController.delAds);
router.get('/all-ads', adsController.allAds);
router.get('/ads/:adId', adsController.oneAds);

module.exports = router;