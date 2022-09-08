const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Restaurant, RestaurantImage, RestaurantManger, RestaurantTable, RestaurantFoodType, Feedback, Reservation } = require("../Database/database.js");
const op = sequelize.Op;
var geodist = require('geodist');
module.exports = {
    async createRestaurant(req, res, next) {
        try {
            const {
                title,
                description,
                policy,
                promotionalText,
                mainLogo,
                openingTime,
                closingTime,
                seatingArea,
                foodType,
                type,
                isSpecialEventSupport,
                restaurantMangerId,
                latitude,
                longitude,
                location,
                assignRestaurant,
            } = req.body;
            const createRestaurant = await Restaurant.create({
                title: title,
                description: description,
                promotionalText: promotionalText,
                policy: policy,
                mainLogo: mainLogo,
                openingTime: openingTime,
                closingTime: closingTime,
                seatingArea: seatingArea,
                type: type,
                isSpecialEventSupport: isSpecialEventSupport,
                restaurantMangerId: restaurantMangerId,
                latitude: latitude,
                longitude: longitude,
                location: location,
            });



            const bulkData = [];

            await foodType.forEach(element => {
                bulkData.push(
                    {
                        foodTypeId: element,
                        restaurantId: createRestaurant.id,
                    }
                )

            });

            const assignManager = await RestaurantManger.update({
                assignRestaurant: true,
            }, {
                where: {
                    id: restaurantMangerId,
                }
            });

            await RestaurantFoodType.bulkCreate(bulkData);

            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Restaurant created successfully",
                Restaurant: createRestaurant,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Restaurant",
                    err: error,
                });
        }
    },

    async updateRestaurant(req, res, next) {
        try {
            const restaurantId = req.params.restaurantId;
            const {
                title,
                description,
                policy,
                promotionalText,
                mainLogo,
                openingTime,
                closingTime,
                seatingArea,
                foodType,
                type,
                isSpecialEventSupport,
                restaurantMangerId,
                latitude,
                longitude,
                location,
                preRestaurantMangerId,
            } = req.body;
            const deleteRestaurantFoodType = await RestaurantFoodType.destroy({
                where: {
                    restaurantId: restaurantId,
                },
            });
            const UnassignManager = await RestaurantManger.update({
                assignRestaurant: false,
            }, {
                where: {
                    id: preRestaurantMangerId,
                }
            });
            const updateRestaurant = await Restaurant.update(
                {
                    title: title,
                    description: description,
                    promotionalText: promotionalText,
                    policy: policy,
                    mainLogo: mainLogo,
                    openingTime: openingTime,
                    closingTime: closingTime,
                    seatingArea: seatingArea,
                    type: type,
                    isSpecialEventSupport: isSpecialEventSupport,
                    restaurantMangerId: restaurantMangerId,
                    latitude: latitude,
                    longitude: longitude,
                    location: location,
                },
                {
                    where: {
                        id: restaurantId,
                    },
                }
            );
            const findRestaurant = await Restaurant.findOne({
                where: {
                    id: restaurantId,
                },
            });
          
            const bulkData = [];

            await foodType.forEach(element => {
                bulkData.push(
                    {
                        foodTypeId: element,
                        restaurantId: restaurantId,
                    }
                )

            });
            const assignManager = await RestaurantManger.update({
                assignRestaurant: true,
            }, {
                where: {
                    id: restaurantMangerId,
                }
            });

            await RestaurantFoodType.bulkCreate(bulkData);
            if (findRestaurant) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Restaurant updated successfully",
                    Restaurant: findRestaurant,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Restaurant not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Restaurant Update",
                    err: error,
                });
        }
    },
    async deleteRestaurant(req, res, next) {
        try {
            const restaurantId = req.params.restaurantId;
            const restaurantMangerId = req.params.restaurantMangerId;
            const deleteRestaurant = await Restaurant.destroy({
                where: {
                    id: restaurantId,
                },
            });
            const deleteRestaurantTable = await RestaurantTable.destroy({
                where: {
                    restaurantId: restaurantId,
                },
            });
            const deleteRestaurantReservation = await Reservation.destroy({
                where: {
                    restaurantId: restaurantId,
                },
            });
            const unassignManager = await RestaurantManger.update({
                assignRestaurant: false,
            }, {
                where: {
                    id: restaurantMangerId,
                }
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Restaurant deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Restaurant delete",
                    err: error,
                });
        }
    },
    async allRestaurant(req, res, next) {
        try {
            const restaurant = await Restaurant.findAll({
                where: {
                    type: "Restaurant",
                },
                include: [
                    {
                        model: RestaurantManger,
                        attributes: ['fullName'],
                    },
                    {
                        model: Feedback,
                    }
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurant);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Restaurant",
                    err: error,
                });
        }
    },
    async allTeaShop(req, res, next) {
        try {
            const restaurant = await Restaurant.findAll({
                where: {
                    type: "Tea",
                },
                include: [
                    {
                        model: RestaurantManger,
                        attributes: ['fullName'],
                    },
                    {
                        model: Feedback,
                    }
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurant);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Restaurant",
                    err: error,
                });
        }
    },
    async allTeaShopNearBy(req, res, next) {

        try {
            const {
                latitude,
                longitude,
                searchInKm,
            } = req.body;
            const nearByTeaShop = [];
            const tea = await Restaurant.findAll({
                where: {
                    type: "Restaurant",
                },
                include: [
                    {
                        model: RestaurantManger,
                        attributes: ['fullName'],
                    },
                    {
                        model: Feedback,
                        required: false
                    }
                ],
            });
            var userCurrentLocation = {
                lat: latitude,
                lon: longitude,
            };
            if (tea.length != 0) {
                tea.forEach(async (teaType) => {
                    var isNearByTeaShopLocation = {
                        lat: teaType.dataValues.latitude,
                        lon: teaType.dataValues.longitude,
                    }
                    var dist = geodist(userCurrentLocation, isNearByTeaShopLocation, {
                        format: true,
                        unit: 'meters',
                    })
                    var distanceInMeters = dist.substr(0, dist.indexOf(' '));
                    if (distanceInMeters < (10 * 1000)) {  // TODO! need to change when require searchInKm
                        var teaShopObj = {
                            "id": teaType.id,
                            "foodTypeId": teaType.foodTypeId,
                            "restaurantId": teaType.restaurantId,
                            "restaurant": {
                                "id": teaType.dataValues.id,
                                "title": teaType.dataValues.title,
                                "description": teaType.dataValues.description,
                                "promotionalText": teaType.dataValues.promotionalText,
                                "mainLogo": teaType.dataValues.mainLogo,
                                "openingTime": teaType.dataValues.openingTime,
                                "closingTime": teaType.dataValues.closingTime,
                                "seatingArea": teaType.dataValues.seatingArea,
                                "latitude": teaType.dataValues.latitude,
                                "longitude": teaType.dataValues.longitude,
                                "location": teaType.dataValues.location,
                                "type": teaType.dataValues.type,
                                "isSpecialEventSupport": teaType.dataValues.isSpecialEventSupport,
                                "createdAt": teaType.dataValues.createdAt,
                                "restaurantMangerId": teaType.dataValues.restaurantMangerId,
                                "distanceInMeters": (Number(distanceInMeters / 1000)).toFixed(1),
                                "rating": teaType.dataValues.feedbacks.length != 0 ? teaType.dataValues.feedbacks[0].rating : 0,
                            }
                        }
                        await nearByTeaShop.push(teaShopObj)
                    }
                });
                return res.status(http_status_codes.StatusCodes.OK).json(nearByTeaShop);
            }
            else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    errors: 'Oops! No Near By Restaurant is Found!'
                });
            }
            return res.status(http_status_codes.StatusCodes.OK).json(tea);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all tea",
                    err: error,
                });
        }
    },
    async oneRestaurant(req, res, next) {
        try {
            const restaurantId = req.params.restaurantId;

            const restaurant = await Restaurant.findOne({
                where: {
                    id: restaurantId,
                },
                include: [
                    {
                        model: RestaurantImage,
                        attributes: ['imageUrl'],
                    },
                    {
                        model: Feedback,
                        required: false,
                    },
                    {
                        model: RestaurantManger,
                        required: false,
                    },
                    {
                        model: RestaurantFoodType,
                        required: false,
                    }
                ],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurant);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one Restaurant ",
                    err: error,
                });
        }
    },

};