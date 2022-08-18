var express = require("express");
var router = express.Router();
const { User } = require("../Database/database.js");
const userController = require('../Controller/User.js');

/* GET User listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
//   create user Routes
router.post('/register', userController.registerUser);
router.post('/sign-in', userController.signInUser);
router.post('/is-user-exist', userController.isUserExist);
router.post('/change-password/:userId', userController.changePassword);
router.post('/update-password/:userId', userController.updatePassword);
router.delete('/delete/:userId', userController.deleteUser);
router.get('/all-user', userController.allUser);
router.get('/one-user/:userId', userController.oneUser);
router.get('/block/:userId', userController.UserBlock);
router.post('/update-user/:userId', userController.updateUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/block-user/:userId', userController.blockUser);
module.exports = router;