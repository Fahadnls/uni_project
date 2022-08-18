var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
// var forceSSL = require('express-force-ssl');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var FoodTypeRouter = require('./routes/FoodType');
var RestaurantRouter = require('./routes/Restaurant');
var messageRouter = require('./routes/message');
var RestaurantFoodTypeRouter = require('./routes/RestaurantFoodType');
var RestaurantImageRouter = require('./routes/RestaurantImage');
var RestaurantMangerRouter = require('./routes/RestaurantManger');
var RestaurantTableRouter = require('./routes/RestaurantTable');
var ReservationRouter = require('./routes/Reservation');
var SupportRouter = require('./routes/Support');
var UserRouter = require('./routes/User');
var FeedbackRouter = require('./routes/feedback');
var ImageRouter = require('./routes/image');
var advertisementRouter = require('./routes/advertisement');
var restaurantMenuRouter = require('./routes/restaurant_menu');

var app = express();
app.use(cors());
// app.use(forceSSL);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'Images')));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', UserRouter);
app.use('/restaurantManger', RestaurantMangerRouter);
app.use('/message', messageRouter);
app.use('/foodType', FoodTypeRouter);
app.use('/dashboard', dashboardRouter);
app.use('/reservation', ReservationRouter);
app.use('/restaurant', RestaurantRouter);
app.use('/restaurantFoodType', RestaurantFoodTypeRouter);
app.use('/support', SupportRouter);
app.use('/restaurantImage', RestaurantImageRouter);
app.use('/restaurantTable', RestaurantTableRouter);
app.use('/feedback', FeedbackRouter);
app.use('/image', ImageRouter);
app.use('/advertisement', advertisementRouter);
app.use('/restaurant-menu', restaurantMenuRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
