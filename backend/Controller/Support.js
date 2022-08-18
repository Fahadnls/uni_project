const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Support,User } = require("../Database/database.js");
const op = sequelize.Op;
module.exports = {
    async createSupport(req, res, next) {
        try {
            const {
                subject,
                message,
                email,
                userId,
            } = req.body;
            const createSupport = await Support.create({
                subject: subject,
                message: message,
                email:email,
                userId: userId,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "Support created successfully",
                Support: createSupport,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create Support",
                    err: error,
                });
        }
    },
    async deleteSupport(req, res, next) {
        try {
            const supportId = req.params.supportId;
            const deleteSupport = await Support.destroy({
                where: {
                    id: supportId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "Support deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in Support delete",
                    err: error,
                });
        }
    },
    async allSupport(req, res, next) {

        try {
            const support = await Support.findAll({
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: User,
                    }
                ]
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(support);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all support",
                    err: error,
                });
        }
    },
    async oneSupport(req, res, next) {
        try {
            const supportId = req.params.supportId;

            const support = await Support.findOne({
                where: {
                    id: supportId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(support);
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