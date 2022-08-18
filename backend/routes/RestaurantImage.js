var express = require("express");
var router = express.Router();
const { RestaurantImage } = require("../Database/database.js");
const restaurantImageController = require('../Controller/RestaurantImage.js');

/* GET RestaurantImage listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create RestaurantImage Routes

router.post('/create', restaurantImageController.createRestaurantImage);
router.delete('/delete/:restaurantImageId', restaurantImageController.deleteRestaurantImage);
router.get('/all-RestaurantImage/:restaurantId', restaurantImageController.allRestaurantImage);
router.get('/one-RestaurantImage/:restaurantImageId', restaurantImageController.oneRestaurantImage);

module.exports = router;