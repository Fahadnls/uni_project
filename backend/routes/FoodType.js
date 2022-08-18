var express = require("express");
var router = express.Router();
const { FoodType } = require("../Database/database.js");
const foodTypeController = require('../Controller/FoodType.js');

/* GET FoodType listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create FoodType Routes

router.post('/create', foodTypeController.createFoodType);
router.post('/update/:foodTypeId', foodTypeController.updateFoodType);
router.delete('/delete/:foodTypeId', foodTypeController.deleteFoodType);
router.get('/all-foodType', foodTypeController.allFoodType);

module.exports = router;