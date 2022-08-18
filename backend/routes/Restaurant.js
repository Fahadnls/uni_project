var express = require("express");
var router = express.Router();
const { Restaurant } = require("../Database/database.js");
const restaurantController = require('../Controller/Restaurant.js');

/* GET Restaurant listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create Restaurant Routes

router.post('/create-restaurant', restaurantController.createRestaurant);
router.post('/update/:restaurantId', restaurantController.updateRestaurant);
router.delete('/delete/:restaurantId/:restaurantMangerId', restaurantController.deleteRestaurant);
router.get('/all-Restaurant', restaurantController.allRestaurant);
router.get('/all-tea-shop', restaurantController.allTeaShop);
router.post('/all-tea-shop-nearby', restaurantController.allTeaShopNearBy);
router.get('/one-Restaurant/:restaurantId', restaurantController.oneRestaurant);

module.exports = router;