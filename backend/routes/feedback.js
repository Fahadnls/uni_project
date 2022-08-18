var express = require("express");
var router = express.Router();
const { Feedback } = require("../Database/database.js");
const feedbackController = require('../Controller/feedback.js');

/* GET FoodType listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create FoodType Routes

router.post('/create', feedbackController.createFeedback);
router.get('/all-feedback', feedbackController.allFeedback);

module.exports = router;