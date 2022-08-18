const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { RestaurantImage } = require("../Database/database.js");
const op = sequelize.Op;
module.exports = {
    async createRestaurantImage(req, res, next) {
        try {
            const {
                uploadImages,
                restaurantId,
            } = req.body;
            const ImagesArray = await uploadImages.map((element, index) => {
                return {
                    restaurantId: restaurantId,
                    imageUrl: element,
                }
            });

            const bulkRestaurantImage = await RestaurantImage.bulkCreate(ImagesArray);
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Restaurant Image created successfully",
                RestaurantImage: bulkRestaurantImage,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Restaurant Image",
                    err: error,
                });
        }
    },
    async deleteRestaurantImage(req, res, next) {
        try {
            const restaurantImageId = req.params.restaurantImageId;
            const deleteRestaurantImage = await RestaurantImage.destroy({
                where: {
                    id: restaurantImageId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Restaurant Image deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Restaurant Image delete",
                    err: error,
                });
        }
    },
    async allRestaurantImage(req, res, next) {

        try {
            const restaurantId = req.params.restaurantId;
            const restaurantImage = await RestaurantImage.findAll({
                where: {
                    restaurantId: restaurantId,
                },
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantImage);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all RestaurantImage",
                    err: error,
                });
        }
    },
    async oneRestaurantImage(req, res, next) {
        try {
            const restaurantImageId = req.params.restaurantImageId;

            const restaurantImage = await RestaurantImage.findOne({
                where: {
                    id: restaurantImageId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantImage);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one restaurant Image ",
                    err: error,
                });
        }
    },

}