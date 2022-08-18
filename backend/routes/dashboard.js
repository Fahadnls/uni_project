var express = require("express");
var router = express.Router();
const dashboardController = require('../Controller/dashboard.js');

router.get('/get-dashboard-data-for-super-admin', dashboardController.getSuperAdminDashboardData);
router.get('/get-dashboard-data-for-restaurant/:restaurantId', dashboardController.getRestaurantDashboardData);
// router.get('/all-feedback', dashboardController.allFeedback);

module.exports = router;