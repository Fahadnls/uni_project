const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Feedback, Restaurant, Reservation } = require("../Database/database.js");
const op = sequelize.Op;

module.exports = {
    async createFeedback(req, res, next) {
        try {

            const {
                rating,
                feedback,
                restaurantId,
                reservationId,
            } = req.body;

            const updateReservation = await Reservation.update(
                {
                    feedback: feedback,
                    rating: rating,
                },

                {
                    where: {
                        id: reservationId,
                    }
                }
            );

            const findFeedback = await Feedback.findOne(
                {
                    where: {
                        restaurantId: restaurantId,
                    }
                }
            );

            if (findFeedback) {

                if (findFeedback.rateCount === 1) {

                    Feedback.update(
                        {
                            rateCount: (findFeedback.rateCount + 1),
                            rating: (findFeedback.rating + rating) / 2
                        },
                        {
                            where: {
                                restaurantId: restaurantId
                            }
                        }
                    )
                        .then(() => {
                            return res
                                .status(http_status_codes.StatusCodes.OK)
                                .json({
                                    message: "Rated Successfully"
                                });
                        });

                } else if (findFeedback.rateCount > 1) {

                    Feedback.update(
                        {
                            rating: ((findFeedback.rating * findFeedback.rateCount) + rating) / (findFeedback.rateCount + 1),
                            rateCount: findFeedback.rateCount + 1,
                        },
                        {
                            where: {
                                restaurantId: restaurantId
                            }
                        }
                    )
                        .then(() => {
                            return res.status(http_status_codes.StatusCodes.OK).json({
                                message: "Rated Successfully"
                            });
                        });

                }
            } else {

                const createFeedback = await Feedback.create(
                    {
                        rateCount: 1,
                        rating: rating,
                        restaurantId: restaurantId,
                    }
                );

                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Rated Successfully"
                });
            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Feedback",
                    err: error,
                });
        }
    },
    async allFeedback(req, res, next) {

        try {
            const feedbacks = await Feedback.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(feedbacks);
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