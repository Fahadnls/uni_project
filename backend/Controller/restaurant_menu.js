const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { RestaurantMenu , MenuDetail, Restaurant} = require("../Database/database");
const op = sequelize.Op;
module.exports = {
    async createRestaurantMenu(req, res, next) {
        try {
            const {
                title,
                restaurantId,
            } = req.body;
            const createRestaurantMenu = await RestaurantMenu.create({
                title: title,
                restaurantId: restaurantId,

            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "RestaurantMenu created successfully",
                restaurantMenu: createRestaurantMenu,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Restaurant Menu",
                    err: error,
                });
        }
    },
    async updateRestaurantMenu(req, res, next) {
        try {
            const restaurantMenuId = req.params.restaurantMenuId;
            const {
                title,
                restaurantId,
            } = req.body;
            const updateRestaurantMenu = await RestaurantMenu.update(
                {
                    title : title,
                    restaurantId :  restaurantId
                },
                {
                    where: {
                        id: restaurantMenuId,
                    },
                }
            );
            const findRestaurantMenu = await RestaurantMenu.findOne({
                where: {
                    id: restaurantMenuId,
                },
            });
            if (findRestaurantMenu) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Restaurant Menu updated successfully",
                    restaurantMenu: findRestaurantMenu,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Restaurant Menu not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in update Restaurant Menu",
                    err: error,
                });
        }
    },
    async delRestaurantMenu(req, res, next) {
        try {
            const MenuId = req.params.MenuId;
            const deleteRestaurantMenu = await MenuDetail.destroy({
                where: {
                    id: MenuId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Restaurant menu deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Restaurant menu delete",
                    err: error,
                });
        }
    },
    async allRestaurantMenu(req, res, next) {

        try {
            
            const restaurantId = req.params.restaurantId;
              const oneRestaurant = await Restaurant.findOne({
                where: {
                    id: restaurantId,
                },
            });
            const allRestaurantMenu = await RestaurantMenu.findAll({
                where:{
                    restaurantId: restaurantId
                },
                include:[
                    {
                        model:MenuDetail
                    }
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json({
                restaurant : oneRestaurant.title,
                restaurantMenu : allRestaurantMenu
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all all Restaurant Menu",
                    err: error,
                });
        }
    },
    async oneRestaurantMenu(req, res, next) {
        try {
            const restaurantMenuId = req.params.restaurantMenuId;

            const oneRestaurantMenu = await RestaurantMenu.findOne({
                where: {
                    id: restaurantMenuId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(oneRestaurantMenu);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one RestaurantMenu ",
                    err: error,
                });
        }
    },

    async createMenuDetail(req, res, next) {
        try {
            const {
                title,
                image,
                price,
                restaurantMenuId
            } = req.body;
            const createMenuDetail = await MenuDetail.create({
                title : title,
                image : image,
                price : price,
                restaurantMenuId : restaurantMenuId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Menu Detail created successfully",
                menuDetail: createMenuDetail,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Menu Detail",
                    err: error,
                });
        }
    },
    async updateMenuDetail(req, res, next) {
        try {
            const menuDetailId = req.params.menuDetailId;
            const {
                title ,
                image ,
                price ,
                restaurantMenuId ,
            } = req.body;
            const updateMenuDetail = await MenuDetail.update(
                {
                    title : title,
                    image : image,
                    price : price,
                    restaurantMenuId : restaurantMenuId,
                },
                {
                    where: {
                        id: menuDetailId,
                    },
                }
            );
            const findMenuDetail = await MenuDetail.findOne({
                where: {
                    id: menuDetailId,
                },
            });
            if (findMenuDetail) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Menu Detail updated successfully",
                    menuDetail: findMenuDetail,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Menu Detail not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in update MenuDetail",
                    err: error,
                });
        }
    },
    async delMenuDetail(req, res, next) {
        try {
            const menuDetailId = req.params.menuDetailId;
            const deleteMenuDetail = await RestaurantMenu.destroy({
                where: {
                    id: menuDetailId,
                },
            });
            const deleteRestaurantMenu = await MenuDetail.destroy({
                where: {
                    restaurantMenuId: menuDetailId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Restaurant Menu deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in RestaurantMenu delete",
                    err: error,
                });
        }
    },
}