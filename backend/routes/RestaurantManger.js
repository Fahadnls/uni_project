var express = require("express");
var router = express.Router();
const { RestaurantManger } = require("../Database/database.js");
const restaurantMangerController = require('../Controller/RestaurantManger.js');

/* GET RestaurantManger listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create RestaurantManger Routes
router.post('/register', restaurantMangerController.registerRestaurantManger);
router.post('/sign-in', restaurantMangerController.signInRestaurantManger);
router.get('/all-manager', restaurantMangerController.allManger);
router.get('/all-manager-unassign', restaurantMangerController.allUnManger);
router.post('/reset-password/:restaurantMangerId', restaurantMangerController.resetPassword);
router.delete('/delete/:restaurantMangerId', restaurantMangerController.deleteRestaurantManger);
router.get('/one-restaurantManger/:restaurantMangerId', restaurantMangerController.oneRestaurantManger);
router.post('/update-restaurantManger/:restaurantMangerId', restaurantMangerController.updateRestaurantManger);
router.post('/block-restaurantManger/:restaurantMangerId', restaurantMangerController.blockManager);
router.get('/block-check/:restaurantMangerId', restaurantMangerController.checkBlockManager);


module.exports = router;