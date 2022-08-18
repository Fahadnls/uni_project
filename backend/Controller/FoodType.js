const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { FoodType } = require("../Database/database.js");
const op = sequelize.Op;
module.exports = {
    async createFoodType(req, res, next) {
        try {
            const {
                type,
                icon,
                typeArabic
            } = req.body;
            const createFoodType = await FoodType.create({
                type: type,
                icon: icon,
                typeArabic :  typeArabic,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Food Type created successfully",
                foodType: createFoodType,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create FoodType",
                    err: error,
                });
        }
    },
    async updateFoodType(req, res, next) {
        try {
            const foodTypeId = req.params.foodTypeId;
            const {
                type,
                icon,
                typeArabic
            } = req.body;
            const updateFoodType = await FoodType.update(
                {
                    type: type,
                    icon: icon,
                    typeArabic: typeArabic,
                },
                {
                    where: {
                        id: foodTypeId,
                    },
                }
            );
            const findFoodType = await FoodType.findOne({
                where: {
                    id: foodTypeId,
                },
            });
            if (findFoodType) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Food Type updated successfully",
                    FoodType: findFoodType,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Food Type not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Food Type Update",
                    err: error,
                });
        }
    },
    async deleteFoodType(req, res, next) {
        try {
            const foodTypeId = req.params.foodTypeId;
            const deleteFoodType = await FoodType.destroy({
                where: {
                    id: foodTypeId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Food Type deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Food Type delete",
                    err: error,
                });
        }
    },
    async allFoodType(req, res, next) {

        try {
            const foodType = await FoodType.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(foodType);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Food Type",
                    err: error,
                });
        }
    },

}