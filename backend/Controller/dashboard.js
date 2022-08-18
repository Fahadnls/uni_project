const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const {
  User,
  RestaurantManger,
  Restaurant,
  Reservation,
  RestaurantTable,
} = require("../Database/database.js");
const moment = require("moment");

const op = sequelize.Op;

module.exports = {
  async getSuperAdminDashboardData(req, res, next) {
    try {
      const getUserCount = await User.count();
      const getManagerCount = await RestaurantManger.count();
      const getRestaurantCount = await Restaurant.count(
        {
          where: {
            type: 'Restaurant'
          }
        }
      );
      const getTeaShopCount = await Restaurant.count(
        {
          where: {
            type: 'Tea'
          }
        }
      );
      const getReservationCount = await Reservation.count();
      const getReservedCount = await Reservation.count({
        where: {
          status: "Reserved",
        },
      });
      const getCompletedCount = await Reservation.count({
        where: {
          status: "Completed",
        },
      });
      const getCancelledCount = await Reservation.count({
        where: {
          status: "Cancel",
        },
      });

      const getFiveReservations = await Reservation.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Restaurant,
          },
          {
            model: User,
          },
        ]
      });

      return res.status(http_status_codes.StatusCodes.OK).json({
        totalUsers: getUserCount,
        totalManagers: getManagerCount,
        totalRestaurants: getRestaurantCount,
        totalTeaShop: getTeaShopCount,
        totalReservations: getReservationCount,
        reservedReservation: getReservedCount,
        completedReservations: getCompletedCount,
        cancelledReservation: getCancelledCount,
        reservedArray: [getReservedCount, getCompletedCount, getCancelledCount],
        getFiveReservations: getFiveReservations,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error occurred in create Feedback",
          err: error,
        });
    }
  },
  async getRestaurantDashboardData(req, res, next) {
    try {
      const restaurantId = req.params.restaurantId;
      const getReservationCount = await Reservation.count({
        where: {
          restaurantId: restaurantId,
        },
      });
      const getReservedCount = await Reservation.count({
        where: {
          status: "Reserved",
          restaurantId: restaurantId,
        },
      });
      const getCompletedCount = await Reservation.count({
        where: {
          status: "Completed",
          restaurantId: restaurantId,
        },
      });
      const getCancelledCount = await Reservation.count({
        where: {
          status: "Cancel",
          restaurantId: restaurantId,
        },
      });

      const getFiveReservations = await Reservation.findAll({
        where: {
          restaurantId: restaurantId,
          status: "Reserved",
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Restaurant,
          },
          {
            model: User,
          },
          {
            model: RestaurantTable,
          }
        ]
      });

      return res.status(http_status_codes.StatusCodes.OK).json({
        totalReservations: getReservationCount,
        reservedReservation: getReservedCount,
        completedReservations: getCompletedCount,
        cancelledReservation: getCancelledCount,
        reservedArray: [getReservedCount, getCompletedCount, getCancelledCount],
        getFiveReservations: getFiveReservations,
      });
    } catch (error) {
      return res
        .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          error: "error occurred in create Feedback",
          err: error,
        });
    }
  },
};
