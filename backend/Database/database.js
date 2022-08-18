var Sequelize = require('sequelize');
var userModal = require("../Models/User.js")
var FoodTypeModal = require("../Models/FoodType.js")
var ReservationModal = require("../Models/Reservation.js")
var RestaurantModal = require("../Models/Restaurant.js")
var RestaurantFoodTypeModal = require("../Models/RestaurantFoodType.js")
var RestaurantImageModal = require("../Models/RestaurantImage.js")
var RestaurantMangerModal = require("../Models/RestaurantManger.js")
var RestaurantTableModal = require("../Models/RestaurantTable.js")
var SupportModal = require("../Models/Support.js")
var conversationModal = require("../Models/conversation.js")
var messageModal = require("../Models/message.js")
var feedbackModal = require("../Models/feedback.js")
var adsModal = require("../Models/advertisement.js")
var restaurantMenuModal = require("../Models/restaurant_menu")
var menuDetailModal = require("../Models/menu_detail")



// const sequelize = new Sequelize("restaurant_management", "root", "root1234", {
const sequelize = new Sequelize("restaurant_management", "root", "", {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
const User = userModal(sequelize, Sequelize);
const FoodType = FoodTypeModal(sequelize, Sequelize);
const Reservation = ReservationModal(sequelize, Sequelize);
const Restaurant = RestaurantModal(sequelize, Sequelize);
const RestaurantFoodType = RestaurantFoodTypeModal(sequelize, Sequelize);
const RestaurantImage = RestaurantImageModal(sequelize, Sequelize);
const RestaurantManger = RestaurantMangerModal(sequelize, Sequelize);
const RestaurantTable = RestaurantTableModal(sequelize, Sequelize);
const Support = SupportModal(sequelize, Sequelize);
const Conversation = conversationModal(sequelize, Sequelize);
const Message = messageModal(sequelize, Sequelize);
const Feedback = feedbackModal(sequelize, Sequelize);
const Advertisement = adsModal(sequelize, Sequelize);
const RestaurantMenu = restaurantMenuModal(sequelize, Sequelize);
const MenuDetail = menuDetailModal(sequelize, Sequelize);



// relations

RestaurantFoodType.belongsTo(FoodType);
FoodType.hasMany(RestaurantFoodType);

RestaurantFoodType.belongsTo(Restaurant);
Restaurant.hasMany(RestaurantFoodType);

Restaurant.belongsTo(RestaurantManger);
RestaurantManger.hasMany(Restaurant);

RestaurantImage.belongsTo(Restaurant);
Restaurant.hasMany(RestaurantImage);

RestaurantTable.belongsTo(Restaurant);
Restaurant.hasMany(RestaurantTable);

RestaurantMenu.belongsTo(Restaurant);
Restaurant.hasMany(RestaurantMenu);

MenuDetail.belongsTo(RestaurantMenu);
RestaurantMenu.hasMany(MenuDetail);

Reservation.belongsTo(Restaurant);
Restaurant.hasMany(Reservation);

Reservation.belongsTo(RestaurantTable);
RestaurantTable.hasMany(Reservation);

Reservation.belongsTo(User);
User.hasMany(Reservation);

Feedback.belongsTo(Restaurant);
Restaurant.hasMany(Feedback);

Support.belongsTo(User);
User.hasMany(Support);

/* Message */
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

Message.belongsTo(User);
User.hasMany(Message);

sequelize.sync({ alter: true }).then(() => {
  console.log(`Database & tables created!`);
});

module.exports = {
  User,
  FoodType,
  Reservation,
  Restaurant,
  RestaurantFoodType,
  RestaurantImage,
  RestaurantManger,
  RestaurantTable,
  Support,
  Conversation,
  Message,
  Feedback,
  Advertisement,
  RestaurantMenu,
  MenuDetail,
}