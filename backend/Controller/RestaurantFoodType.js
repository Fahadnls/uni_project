const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { RestaurantFoodType, Restaurant, Feedback } = require("../Database/database.js");
const op = sequelize.Op;
var geodist = require('geodist');
const { NUMBER } = require("sequelize");
module.exports = {
    async createRestaurantFoodType(req, res, next) {
        try {
            const {
                foodTypeId,
                restaurantId,
            } = req.body;
            const createRestaurantFoodType = await RestaurantFoodType.create({
                foodTypeId: foodTypeId,
                restaurantId: restaurantId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "RestaurantFoodType created successfully",
                RestaurantFoodType: createRestaurantFoodType,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create RestaurantFoodType",
                    err: error,
                });
        }
    },
    async deleteRestaurantFoodType(req, res, next) {
        try {
            const restaurantFoodTypeId = req.params.restaurantFoodTypeId;
            const deleteRestaurantFoodType = await RestaurantFoodType.destroy({
                where: {
                    id: restaurantFoodTypeId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "RestaurantFoodType deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in RestaurantFoodType delete",
                    err: error,
                });
        }
    },
    async allRestaurantFoodType(req, res, next) {

        try {
            const restaurantFoodType = await RestaurantFoodType.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantFoodType);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all restaurantFoodType",
                    err: error,
                });
        }
    },
    async allRestaurantByFoodType(req, res, next) {
        try {
            const {
                latitude,
                longitude,
                searchInKm,
                FoodTypeId,
            } = req.body;
            const nearByRestaurant = [];
            const restaurantFoodType = await RestaurantFoodType.findAll({
                where: {
                    foodTypeId: FoodTypeId,
                },
                include: [
                    {
                        model: Restaurant,
                        include: [
                            {
                                model: Feedback,
                                required: false,
                            }
                        ]
                    },
                ],
            });
            var userCurrentLocation = {
                lat: latitude,
                lon: longitude,
            };
            if (restaurantFoodType.length != 0) {
                restaurantFoodType.forEach(async (FoodType) => {
                    var isNearByRestaurantLocation = {
                        lat: FoodType.dataValues.restaurant.dataValues.latitude,
                        lon: FoodType.dataValues.restaurant.dataValues.longitude,
                    }
                    var dist = geodist(userCurrentLocation, isNearByRestaurantLocation, {
                        format: true,
                        unit: 'meters',
                    })
                    var distanceInMeters = dist.substr(0, dist.indexOf(' '));
                    if (distanceInMeters < (24000000 * 1000)) { // TODO! need to change when require searchInKm
                        var restaurantObj = {
                            "id": FoodType.id,
                            "foodTypeId": FoodType.foodTypeId,
                            "restaurantId": FoodType.restaurantId,
                            "restaurant": {
                                "id": FoodType.dataValues.restaurant.dataValues.id,
                                "title": FoodType.dataValues.restaurant.dataValues.title,
                                "description": FoodType.dataValues.restaurant.dataValues.description,
                                "promotionalText": FoodType.dataValues.restaurant.dataValues.promotionalText,
                                "mainLogo": FoodType.dataValues.restaurant.dataValues.mainLogo,
                                "openingTime": FoodType.dataValues.restaurant.dataValues.openingTime,
                                "closingTime": FoodType.dataValues.restaurant.dataValues.closingTime,
                                "seatingArea": FoodType.dataValues.restaurant.dataValues.seatingArea,
                                "latitude": FoodType.dataValues.restaurant.dataValues.latitude,
                                "longitude": FoodType.dataValues.restaurant.dataValues.longitude,
                                "location": FoodType.dataValues.restaurant.dataValues.location,
                                "type": FoodType.dataValues.restaurant.dataValues.type,
                                "isSpecialEventSupport": FoodType.dataValues.restaurant.dataValues.isSpecialEventSupport,
                                "createdAt": FoodType.dataValues.restaurant.dataValues.createdAt,
                                "restaurantMangerId": FoodType.dataValues.restaurant.dataValues.restaurantMangerId,
                                "distanceInMeters": (Number(distanceInMeters / 1000)).toFixed(1),
                                "rating": FoodType.dataValues.restaurant.dataValues.feedbacks.length != 0 ?
                                    FoodType.dataValues.restaurant.dataValues.feedbacks[0].rating : 0,
                            }
                        }
                        await nearByRestaurant.push(restaurantObj)
                    }
                });
                return res.status(http_status_codes.StatusCodes.OK).json(nearByRestaurant);
            }
            else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    errors: 'Oops! No Near By Restaurant is Found!'
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get near by all Restaurant ",
                    err: error,
                });
        }
    },
}