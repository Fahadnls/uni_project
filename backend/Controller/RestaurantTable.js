const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { RestaurantTable } = require("../Database/database.js");
const op = sequelize.Op;
module.exports = {
    async createRestaurantTable(req, res, next) {
        try {
            const {

                seatingCapacity,
                tableNumber,
                restaurantId,
            } = req.body;
            const createRestaurantTable = await RestaurantTable.create({

                seatingCapacity: seatingCapacity,
                tableNumber: tableNumber,
                restaurantId: restaurantId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Restaurant Table created successfully",
                RestaurantTable: createRestaurantTable,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create RestaurantTable",
                    err: error,
                });
        }
    },
    async updateRestaurantTable(req, res, next) {
        try {
            const restaurantTableId = req.params.restaurantTableId;
            const {
                seatingCapacity,
                tableNumber,
                restaurantId,
            } = req.body;
            const updateRestaurantTable = await RestaurantTable.update(
                {
                    seatingCapacity: seatingCapacity,
                    tableNumber: tableNumber,
                    restaurantId: restaurantId,
                },
                {
                    where: {
                        id: restaurantTableId,
                    },
                }
            );
            const findRestaurantTable = await RestaurantTable.findOne({
                where: {
                    id: restaurantTableId,
                },
            });
            if (findRestaurantTable) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Restaurant updated successfully",
                    restaurantTable: findRestaurantTable,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "restaurant Table not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in restaurant Table Update",
                    err: error,
                });
        }
    },
    async deleteRestaurantTable(req, res, next) {
        try {
            const restaurantTableId = req.params.restaurantTableId;
            const deleteRestaurantTable = await RestaurantTable.destroy({
                where: {
                    id: restaurantTableId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Restaurant Table deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in RestaurantTable delete",
                    err: error,
                });
        }
    },
    async allRestaurantTable(req, res, next) {

        try {
            const restaurantId = req.params.restaurantId;
            const restaurantTable = await RestaurantTable.findAll({
                where: {
                    restaurantId: restaurantId,
                },
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantTable);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all RestaurantTable",
                    err: error,
                });
        }
    },
    async oneRestaurantTable(req, res, next) {
        try {
            const restaurantTableId = req.params.restaurantTableId;

            const restaurantTable = await RestaurantTable.findOne({
                where: {
                    id: restaurantTableId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantTable);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one Restaurant ",
                    err: error,
                });
        }
    },
}