const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Reservation, Restaurant, RestaurantTable ,User } = require("../Database/database.js");
const op = sequelize.Op;
module.exports = {

    async createReservation(req, res, next) {

        try {
            const {
                slotForm,
                slotTo,
                seats,
                additionalNote,
                seatingArea,
                restaurantId,
                reservationDate,
                userId,
            } = req.body;

            const allReservations = await Reservation.findAll(
                {
                    where: {
                        restaurantId: restaurantId,
                        status: "Reserved",
                        reservationDate: reservationDate,
                    }
                }
            );

            const findRestaurantTables = await RestaurantTable.findAll({
                where: {
                    restaurantId: restaurantId,
                    seatingCapacity: {
                        [op.gte]: seats,
                    },
                },
                order: [["seatingCapacity", "ASC"]],
            });

            if (allReservations.length != 0) {

                let foundedArray = [];
                let foundedRestaurant = [];

                allReservations.forEach(element => {
                    if ((element.slotForm.getTime()) == new Date(slotForm).getTime()) {
                        foundedArray.push("false");
                        if (foundedRestaurant.length == findRestaurantTables.length)
                            foundedRestaurant = [];
                        foundedRestaurant.push(element.restaurantTableId);
                    } else {
                        if (
                            ((element.slotForm) > new Date(slotForm))
                        ) {
                            if (
                                ((element.slotForm) >= new Date(slotTo))
                            ) {
                                foundedArray.push("true");
                                if (foundedRestaurant.length == findRestaurantTables.length)
                                    foundedRestaurant = [];
                                foundedRestaurant.push(element.restaurantTableId);
                            } else {
                                foundedArray.push("false");
                                if (foundedRestaurant.length == findRestaurantTables.length)
                                    foundedRestaurant = [];
                                foundedRestaurant.push(element.restaurantTableId);
                            }
                        } else if (new Date(slotForm) > (element.slotForm)) {

                            if (
                                (new Date(slotForm) >= (element.slotTo))
                            ) {
                                if (foundedRestaurant.length == findRestaurantTables.length)
                                    foundedRestaurant = [];
                                foundedRestaurant.push(element.restaurantTableId);
                                foundedArray.push("true");
                            } else {

                                if (foundedRestaurant.length == findRestaurantTables.length)
                                    foundedRestaurant = [];
                                foundedRestaurant.push(element.restaurantTableId);
                                foundedArray.push("false");
                            }

                        }
                    }
                });

                if (foundedArray.length != 0) {

                    if (foundedArray.includes("false")) {

                        if (foundedRestaurant.length == findRestaurantTables.length) {

                            return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                                error: "No Table found in this time slot",
                            });

                        } else {
                            const createReservation = await Reservation.create({
                                slotForm: slotForm,
                                slotTo: slotTo,
                                reservationDate: reservationDate,
                                tableBookingCode: Math.floor(100000 + Math.random() * 900000),
                                additionalNote: additionalNote,
                                seatingArea: seatingArea,
                                status: "Reserved",
                                restaurantId: restaurantId,
                                restaurantTableId: findRestaurantTables[foundedRestaurant.length].dataValues.id,
                                seats: seats,
                                userId: userId,
                            });
                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                message: "Reservation created successfully",
                                Reservation: createReservation,
                            });

                        }

                    } else {

                        if (findRestaurantTables.length != 0) {
                            const createReservation = await Reservation.create({
                                slotForm: slotForm,
                                slotTo: slotTo,
                                reservationDate: reservationDate,
                                tableBookingCode: Math.floor(100000 + Math.random() * 900000),
                                additionalNote: additionalNote,
                                seatingArea: seatingArea,
                                status: "Reserved",
                                restaurantId: restaurantId,
                                restaurantTableId: findRestaurantTables[0].id,
                                seats: seats,
                                userId: userId,
                            });
                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                message: "Reservation created successfully",
                                Reservation: createReservation,
                            });
                        } else {
                            return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                                error: "No Table found in the Restaurant",
                            });
                        }
                        // return res.status(http_status_codes.StatusCodes.CREATED).json({
                        //     message: "All Reservations",
                        //     reservations: allReservations,
                        // });
                    }
                }


            } else {

                if (findRestaurantTables.length != 0) {
                    const createReservation = await Reservation.create({
                        slotForm: slotForm,
                        slotTo: slotTo,
                        reservationDate: reservationDate,
                        tableBookingCode: Math.floor(100000 + Math.random() * 900000),
                        additionalNote: additionalNote,
                        seatingArea: seatingArea,
                        status: "Reserved",
                        restaurantId: restaurantId,
                        restaurantTableId: findRestaurantTables[0].id,
                        seats: seats,
                        userId: userId,
                    });
                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                        message: "Reservation created successfully",
                        Reservation: createReservation,
                    });
                } else {
                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        error: "No Table found in the Restaurant",
                    });
                }


            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Reservation",
                    err: error,
                });
        }
    },

    async allPendingReservation(req, res, next) {

        try {
            const userId = req.params.userId;
            const pendingReservation = await Reservation.findAll({
                where: {
                    userId: userId,
                    status: "Reserved",
                },
                include: [
                    {
                        model: RestaurantTable,
                        attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: Restaurant,
                        attributes: ["mainLogo", "title", "type", "mainLogo","location",],
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            const CompletedReservation = await Reservation.findAll({
                where: {
                    userId: userId,
                    [op.not]: {
                        status: "Reserved",
                    }
                },
                include: [
                    {
                        model: RestaurantTable,
                        attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: Restaurant,
                        attributes: ["mainLogo", "title", "type", "mainLogo","location",],
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            },
            );

            return res.status(http_status_codes.StatusCodes.OK).json({ pendingReservation, CompletedReservation });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Reservation",
                    err: error,
                });
        }
    },

    async restaurantReservation(req, res, next) {

        try {
            const restaurantId = req.params.restaurantId;
            const pendingReservation = await Reservation.findAll({
                where: {
                    restaurantId: restaurantId,
                    status: "Reserved",
                },
                include: [
                    {
                        model: RestaurantTable,
                        attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: User,
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            const CompletedReservation = await Reservation.findAll({
                where: {
                    restaurantId: restaurantId,
                        status: "Completed",
                },
                include: [
                    {
                        model: RestaurantTable,
                        attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: User,
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            },
            );
            const cancelledReservation = await Reservation.findAll({
                where: {
                    restaurantId: restaurantId,
                        status: "Cancel",
                },
                include: [
                    {
                        model: RestaurantTable,
                        attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: User,
                        required: false,
                    },
                ],
                order: [["createdAt", "DESC"]],
            },
            );

            return res.status(http_status_codes.StatusCodes.OK).json({ pendingReservation, CompletedReservation ,cancelledReservation });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all Reservation",
                    err: error,
                });
        }
    },

    async oneReservation(req, res, next) {
        try {
            const reservationId = req.params.reservationId;

            const reservation = await Reservation.findOne({
                where: {
                    id: reservationId,
                },
                include: [
                    {
                        model: RestaurantTable,
                        // attributes: ["tableNumber"],
                        required: false,
                    },
                    {
                        model: Restaurant,
                        // attributes: ["mainLogo","title","type","mainLogo",],
                        required: false,
                    },
                ],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(reservation);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one Reservation ",
                    err: error,
                });
        }
    },

    async statusUpdateReservation(req, res, next) {
        try {
            const reservationId = req.params.reservationId;
            const {
                status,
                cancelReason,
                cancelBy,
            } = req.body;
            const updateRestaurant = await Reservation.update(
                {
                    status: status,
                    cancelReason: cancelReason,
                    cancelBy: cancelBy,
                },
                {
                    where: {
                        id: reservationId,
                    },
                }
            );
            const findRestaurant = await Reservation.findOne({
                where: {
                    id: reservationId,
                },
            });
            if (findRestaurant) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Reservation updated successfully",
                    Restaurant: findRestaurant,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Reservation not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Reservation status Update",
                    err: error,
                });
        }
    },

}