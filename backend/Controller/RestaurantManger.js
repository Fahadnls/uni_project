const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { RestaurantManger, Restaurant } = require("../Database/database.js");
const hashedPassword = require("password-hash");
const nodemailer = require("nodemailer");
const op = sequelize.Op;
module.exports = {

    async registerRestaurantManger(req, res, next) {
        try {
            const {
                fullName,
                password,
                email,
            } = req.body;

            const findRestaurantManger = await RestaurantManger.findOne({
                where: {
                    email: email,
                },
            });
            if (findRestaurantManger) {
                return res
                    .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
                    .json({ error: "Email already Exits!" });
            } else {
                if (password.length < 6) {
                    return res
                        .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
                        .json({ error: "Password should be greater than 6 characters!" });
                } else {
                    const restaurantManger = await RestaurantManger.create({
                        fullName: fullName,
                        email: email,
                        password: hashedPassword.generate(password),
                    });
                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                        message: "Account successfully Created",
                        restaurantManger: restaurantManger
                    });
                }
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error Occurred in Creating Restaurant Manger",
                    err: error,
                });
        }
    },
    async signInRestaurantManger(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body;

            const restaurantManger = await RestaurantManger.findOne({
                where: {
                    email: email,
                },
                include:
                {
                    model: Restaurant,
                    // attributes: ["tableNumber"],
                    required: false,
                },

            });
            if (restaurantManger) {
                const verify_password = hashedPassword.verify(password, restaurantManger.password);
                if (verify_password) {

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: "successfully login",
                        restaurantManger: restaurantManger,
                    });
                } else {
                    return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        error: "Password is incorrect!",
                    });
                }
            } else {
                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    error: "Email does not exist!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error in login",
                    err: error,
                });
        }
    },
    async allManger(req, res, next) {
        try {
            const restaurantManger = await RestaurantManger.findAll({
                where: {
                    [op.not]: {
                        isAdmin: true,
                    }
                },
                order: [["createdAt", "DESC"]],
                include:
                {
                    model: Restaurant,
                    required: false,
                },
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantManger);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all restaurantManger",
                    err: error,
                });
        }
    },
    async allUnManger(req, res, next) {
        try {
            const restaurantManger = await RestaurantManger.findAll({
                where: {
                    assignRestaurant: false,
                },
                order: [["createdAt", "DESC"]],


            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantManger);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all restaurantManger",
                    err: error,
                });
        }
    },
    async OneRestaurantManger(req, res, next) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;

            const restaurantManger = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantManger);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one RestaurantManger ",
                    err: error,
                });
        }
    },
    async resetPassword(req, res) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;

            const {
                oldPassword,
                newPassword,
            } = req.body;

            const findRestaurantManger = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId
                }
            })

            if (findRestaurantManger) {

                if (newPassword.length < 6) {

                    return res
                        .status(http_status_codes.StatusCodes.UNAUTHORIZED)
                        .json({ error: "Password should be greater than 6 characters!" });

                } else {

                    const isAuth = hashedPassword.verify(
                        oldPassword,
                        findRestaurantManger.password,
                    )

                    if (isAuth) {

                        const changePassword = await RestaurantManger.update({
                            password: hashedPassword.generate(newPassword)
                        }, {
                            where: {
                                id: restaurantMangerId
                            }
                        });

                        return res
                            .status(http_status_codes.StatusCodes.ACCEPTED)
                            .json({ message: 'Password Changed Successfully!' });

                    } else if (!isAuth) {
                        return res
                            .status(http_status_codes.StatusCodes.UNAUTHORIZED)
                            .json({ error: 'Invalid old password!' });
                    }
                }


            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurred in reset Password",
                error: error
            });
        }
    },
    async updateRestaurantManger(req, res, next) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;

            const {
                fullName,
                email,
                password,
            } = req.body;

            const findManagerEmail = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId,
                    [op.not]: {
                        email: email,
                    },
                }
            });

            if (findManagerEmail) {
                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED)
                    .json({
                        error: 'email already in use!',
                    });
            } else {
                if (password != "") {
                    if (password.length < 6) {
                        return res
                            .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
                            .json({ error: "Password should be greater than 6 characters!" });
                    } else {
                        const restaurantManger = await RestaurantManger.update(
                            {
                                fullName: fullName,
                                email: email,
                                password: hashedPassword.generate(password),
                            },
                            {
                                where: {
                                    id: restaurantMangerId,
                                }
                            }
                        );
                    }
                } else {
                    const restaurantManger = await RestaurantManger.update(
                        {
                            fullName: fullName,
                            email: email,
                        },
                        {
                            where: {
                                id: restaurantMangerId,
                            }
                        }
                    );
                }
            }

            const findManager = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId
                },
            });

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json(
                    {
                        message: 'restaurantManger updated successfully!',
                        restaurantManger: findManager,
                    }
                );

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Error Occurred in RestaurantManger",
                    err: error
                });
        }
    },
    async deleteRestaurantManger(req, res, next) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;
            const deleteUser = await RestaurantManger.destroy({
                where: {
                    id: restaurantMangerId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "RestaurantManger deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in RestaurantManger delete",
                    err: error,
                });
        }
    },
    async oneRestaurantManger(req, res, next) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;

            const restaurantManger = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantManger);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one restaurantManger ",
                    err: error,
                });
        }
    },
    async checkBlockManager(req, res, next) {
        try {
            const restaurantMangerId = req.params.restaurantMangerId;

            const restaurantManger = await RestaurantManger.findOne({
                where: {
                    id: restaurantMangerId,
                },
                attributes: ['isBlocked'],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(restaurantManger);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one restaurantManger ",
                    err: error,
                });
        }
    },
    async blockManager(req, res, next) {

        try {
            const restaurantMangerId = req.params.restaurantMangerId;
            const {
                isBlocked
            } = req.body;

            const blockUser = await RestaurantManger.update({
                isBlocked: isBlocked,
            }, {
                where: {
                    id: restaurantMangerId,
                }
            });

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json({
                    message:
                        isBlocked ?
                            'RestaurantManger blocked successfully!' : 'RestaurantManger unblocked successfully!'
                });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Error Occurred in blockUser",
                    err: error
                });
        }
    }
}