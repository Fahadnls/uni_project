var express = require("express");
var router = express.Router();
const { RestaurantFoodType } = require("../Database/database.js");
const restaurantFoodTypeController = require('../Controller/RestaurantFoodType.js');

/* GET RestaurantFoodType listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create RestaurantFoodType Routes

router.post('/create', restaurantFoodTypeController.createRestaurantFoodType);
router.delete('/delete/:restaurantFoodTypeId', restaurantFoodTypeController.deleteRestaurantFoodType);
router.get('/all-RestaurantFoodType', restaurantFoodTypeController.allRestaurantFoodType);
router.post('/all-Restaurant-by-FoodType', restaurantFoodTypeController.allRestaurantByFoodType);

module.exports = router;