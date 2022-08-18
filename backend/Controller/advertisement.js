const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { Advertisement } = require("../Database/database");
const op = sequelize.Op;
module.exports = {
    async createAds(req, res, next) {
        try {
            const {
                title,
                image,
                description,
                url,
            } = req.body;
            const createAds = await Advertisement.create({
                title:title,
                image:image,
                description:description,
                url:url,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json({
                message: "ads  created successfully",
                ad: createAds,
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in create ads",
                    err: error,
                });
        }
    },
    async updateAds(req, res, next) {
        try {
            const adId = req.params.adId;
            const {
                title,
                image,
                description,
                url,
            } = req.body;
            const updateAd = await Advertisement.update(
                {
                    title:title,
                    image:image,
                    description:description,
                    url:url,
                },
                {
                    where: {
                        id: adId,
                    },
                }
            );
            const findAds = await Advertisement.findOne({
                where: {
                    id: adId,
                },
            });
            if (findAds) {
                return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                    message: "Ads updated successfully",
                    ad: findAds,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Ads not found!",
                });
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in ads Update",
                    err: error,
                });
        }
    },
    async delAds(req, res, next) {
        try {
            const adId = req.params.adId;
            const deleteAd = await Advertisement.destroy({
                where: {
                    id: adId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "ads deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in ads delete",
                    err: error,
                });
        }
    },
    async allAds(req, res, next) {

        try {
            const advertisement = await Advertisement.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(advertisement);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all ads",
                    err: error,
                });
        }
    },
    async oneAds(req, res, next) {
        try {
            const adId = req.params.adId;

            const ad = await Advertisement.findOne({
                where: {
                    id: adId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(ad);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one ads ",
                    err: error,
                });
        }
    },
}