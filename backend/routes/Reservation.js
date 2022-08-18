var express = require("express");
var router = express.Router();
const { Reservation } = require("../Database/database.js");
const reservationController = require('../Controller/Reservation.js');

/* GET Reservation listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create Reservation Routes

router.post('/create', reservationController.createReservation);
router.get('/all-Reservation/:userId', reservationController.allPendingReservation);
router.get('/all-restaurant-Reservation/:restaurantId', reservationController.restaurantReservation);
router.get('/one-Reservation/:reservationId', reservationController.oneReservation);
router.post('/status-update-in-reservation/:reservationId', reservationController.statusUpdateReservation);

module.exports = router;