var express = require("express");
var router = express.Router();
const restaurantMenuController = require('../Controller/restaurant_menu');

/* GET ads restaurantMenu. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create ads Routes

router.post('/create', restaurantMenuController.createRestaurantMenu);
router.post('/update/:restaurantMenuId', restaurantMenuController.updateRestaurantMenu);
router.get('/all-restaurant-menu/:restaurantId', restaurantMenuController.allRestaurantMenu);
router.get('/list/:restaurantMenuId', restaurantMenuController.oneRestaurantMenu);
router.delete('/del-menu/:MenuId', restaurantMenuController.delRestaurantMenu);

router.post('/create-men-detail', restaurantMenuController.createMenuDetail);
router.post('/update-menu-detail/:menuDetailId', restaurantMenuController.updateMenuDetail);
router.delete('/del-restaurant-menu/:menuDetailId', restaurantMenuController.delMenuDetail);
module.exports = router;