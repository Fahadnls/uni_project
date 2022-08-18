const http_status_codes = require('http-status-codes');
const {
    Message,
    Conversation,
    User,
} = require('../Database/database');
const sequelize = require("sequelize");
const Op = sequelize.Op;
module.exports = {

    async sendMessage(req, res, next) {
        try {

            const {
                userId,
                isAdmin,
                messageBody,
                messageTime
            } = req.body;

            const isConversationExist = await Conversation
                .findOne({
                    where: {
                        userId: userId,
                    }
                });

            if (isConversationExist) {

                const msg = await Message.create({
                    userId: userId,
                    isAdmin: isAdmin,
                    messageBody: messageBody,
                    conversationId: isConversationExist.id,
                });

                if (msg) {
                    Conversation.update({
                        deletedBy: null,
                        messageTime :messageTime
                    }, {
                        where: {
                            id: isConversationExist.id
                        }
                    });
                }
                res
                    .status(http_status_codes.StatusCodes.CREATED)
                    .json({
                        message: 'Message sent successfully',
                        conversationId: isConversationExist.id,
                        msg: msg,
                    });
            } else {
                const createConversation = await Conversation.create({
                    userId: userId,
                });

                const msg = await Message.create({
                    userId: userId,
                    isAdmin: isAdmin,
                    messageBody: messageBody,
                    conversationId: createConversation.id,
                });

                res
                    .status(http_status_codes.StatusCodes.CREATED)
                    .json({
                        message: 'Message sent successfully',
                        conversationId: createConversation.id,
                        msg: msg,
                    });
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurred in Sending Message"
            });
        }
    },

    async getAllMessages(req, res, next) {
        try {
            const userId = req.params.userId;

            const isConversationExist = await Conversation.findOne({
                where: {
                    userId: userId,
                }
            });
            if (isConversationExist) {
                const messages = await Message.findAll({
                    where: {
                        conversationId: isConversationExist.id
                    }
                });
                res
                    .status(http_status_codes.StatusCodes.OK)
                    .json(messages);
            } else {
                res
                    .status(http_status_codes.StatusCodes.NOT_FOUND)
                    .json({
                        error: 'No conversation is started yet!',
                    });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurred in fetching Conversation"
            });
        }
    },

    async getAllConversations(req, res, next) {
        try {


            const allConversations = await Conversation.findAll({
                include: {
                    model: Message,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    limit: 1,
                    include: {
                        model: User,
                        attributes: ['fullName', 'profileImage'],
                    }
                },
                order: [
                    [ 'messageTime', 'DESC']
                ]
            });

            res
                .status(http_status_codes.StatusCodes.OK)
                .json(allConversations);

        } catch (err) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Error Occurred in fetching Conversation",
                    err: err
                });
        }
    },

    async updateDeletedBy(req, res, next) {
        try {

            const {
                conversationId,
                deletedBy
            } = req.body

            Conversation.update({
                deletedBy: deletedBy
            }, {
                where: {
                    id: conversationId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "DeletedBy Updated successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error updateDeletedBy",
                error: error
            })
        }
    },

    async deleteConversation(req, res, next) {
        try {

            const conversationId = req.params.conversationId;

            await Message.destroy({
                where: {
                    conversationId: conversationId
                }
            })

            await Conversation.destroy({
                where: {
                    id: conversationId
                }
            })

            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Conversation and Messages Deleted Successfully"
            })

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error deleteConversation",
                error: error
            })
        }
    },

    async deleteMessage(req, res, next) {
        try {
            const messageId = req.params.messageId;

            Message.update({
                isDeleted: true,
            }, {
                where: {
                    id: messageId
                }
            })

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json('Message Deleted Successfully');

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurred in updateComment",
                err: err
            });
        }
    },
};