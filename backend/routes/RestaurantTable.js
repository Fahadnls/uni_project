var express = require("express");
var router = express.Router();
const { RestaurantTable } = require("../Database/database.js");
const restaurantTableController = require('../Controller/RestaurantTable.js');

/* GET RestaurantTable listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create RestaurantTable Routes

router.post('/create', restaurantTableController.createRestaurantTable);
router.post('/update/:restaurantTableId', restaurantTableController.updateRestaurantTable);
router.delete('/delete/:restaurantTableId', restaurantTableController.deleteRestaurantTable);
router.get('/all-RestaurantTable/:restaurantId', restaurantTableController.allRestaurantTable);
router.get('/one-RestaurantTable/:restaurantTableId', restaurantTableController.oneRestaurantTable);

module.exports = router;