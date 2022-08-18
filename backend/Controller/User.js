const sequelize = require("sequelize");
const http_status_codes = require("http-status-codes");
const { User } = require("../Database/database.js");
const hashedPassword = require("password-hash");
const nodemailer = require("nodemailer");
const op = sequelize.Op;
module.exports = {
    async registerUser(req, res, next) {
        try {
            const {
                fullName,
                // password,
                // email,
                // profileImage,
                phoneNumber,
            } = req.body;

            const findUser = await User.findOne({
                where: {
                    phoneNumber: phoneNumber,
                },
            });
            if (findUser) {
                return res
                    .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
                    .json({
                        error: "Phone Number already Exits!"
                    });
            } else {
                // if (password.length < 6) {
                //     return res
                //         .status(http_status_codes.StatusCodes.NOT_ACCEPTABLE)
                //         .json({ error: "Password should be greater than 6 characters!" });
                // } else {
                    const user = await User.create({
                        fullName: fullName,
                        // profileImage: profileImage,
                        phoneNumber: phoneNumber,
                        // email: email,
                        // password: hashedPassword.generate(password),
                    });
                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                        message: "Account successfully Created",
                        user: user,
                    });
                // }
            }
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "Error Occurred in Creating User",
                    err: error,
                });
        }
    },
    async signInUser(req, res, next) {
        try {
            const {
                email,
                phoneNumber
            } = req.body;

            const user = await User.findOne({
                where: {
                    phoneNumber: phoneNumber,
                },
            });
            if (user) {
                // const verify_password = hashedPassword.verify(password, user.password);
                // if (verify_password) {

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: "successfully login",
                        user: user,
                    });
                // } 
                // else {
                //     return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                //         error: "Password is incorrect!",
                //     });
                // }
            } else {
                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    error: "phone number already exist!",
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
    // async signInUser(req, res, next) {
    //     try {
    //         const {
    //             email,
    //             password
    //         } = req.body;

    //         const user = await User.findOne({
    //             where: {
    //                 email: email,
    //             },
    //         });
    //         if (user) {
    //             const verify_password = hashedPassword.verify(password, user.password);
    //             if (verify_password) {

    //                 return res.status(http_status_codes.StatusCodes.OK).json({
    //                     message: "successfully login",
    //                     user: user,
    //                 });
    //             } else {
    //                 return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
    //                     error: "Password is incorrect!",
    //                 });
    //             }
    //         } else {
    //             return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
    //                 error: "Email does not exist!",
    //             });
    //         }
    //     } catch (error) {
    //         return res
    //             .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
    //             .json({
    //                 error: "error in login",
    //                 err: error,
    //             });
    //     }
    // },
    async isUserExist(req, res, next) {
        try {
            const {
                phoneNumber,
            } = req.body;

            const isEmailAndPhoneExist = await User.findOne({
                where: {
                    // [op.or]: [{
                    //     email: email,
                    // },
                    // {
                        phoneNumber: phoneNumber,
                    // }
                // ]
                }
            })

            if (isEmailAndPhoneExist) {
                return res
                    .status(http_status_codes.StatusCodes.OK)
                    .json(true);
            } else {
                return res
                    .status(http_status_codes.StatusCodes.OK)
                    .json(false);
            }

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Error Occurred in isUserExist",
                    err: err
                });
        }
    },
    async changePassword(req, res) {
        try {
            const userId = req.params.userId;

            const {
                oldPassword,
                newPassword,
            } = req.body;

            const findUser = await User.findOne({
                where: {
                    id: userId
                }
            })

            if (findUser) {

                const isAuth = hashedPassword.verify(
                    oldPassword,
                    findUser.password,
                )
                if (!isAuth) {
                    return res
                        .status(http_status_codes.StatusCodes.UNAUTHORIZED)
                        .json({ error: 'Invalid old password!' });
                } else if (newPassword.length < 6) {
                    return res
                        .status(http_status_codes.StatusCodes.UNAUTHORIZED)
                        .json({ error: "Password should be greater than 6 characters!" });
                } else {
                    const changePassword = await User.update({
                        password: hashedPassword.generate(newPassword)
                    }, {
                        where: {
                            id: userId
                        }
                    });
                    return res
                        .status(http_status_codes.StatusCodes.ACCEPTED)
                        .json({ message: 'Password Changed Successfully!' });

                }


            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurred in reset Password",
                error: error
            });
        }
    },
    async updatePassword(req, res) {
        try {
            const userId = req.params.userId;
            const {
                password
            } = req.body;

            User.update({
                password: hashedPassword.generate(password)
            }, {
                where: {
                    id: userId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Password Updated successfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error updatePassword",
                error: error
            })
        }
    },
    async updateUser(req, res, next) {
        try {
            const userId = req.params.userId;

            const {
                fullName,
                profileImage,
            } = req.body;

            const updateUser = await User.update({
                fullName: fullName,
                profileImage: profileImage,
            },
                {
                    where: {
                        id: userId,
                    }
                }
            );

            const findUser = await User.findOne({
                where: {
                    id: userId
                },
            });

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json(
                    {
                        message: 'User updated successfully!',
                        user: findUser,
                    }
                );

        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: "Error Occurred in updateUser",
                    err: error
                });
        }
    },
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const deleteUser = await User.destroy({
                where: {
                    id: userId,
                },
            });
            return res.status(http_status_codes.StatusCodes.ACCEPTED).json({
                message: "User deleted successfully",
            });
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in User delete",
                    err: error,
                });
        }
    },
    async allUser(req, res, next) {

        try {
            const user = await User.findAll({
                order: [["createdAt", "DESC"]],
            },
            );
            return res.status(http_status_codes.StatusCodes.OK).json(user);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in all user",
                    err: error,
                });
        }
    },
    async oneUser(req, res, next) {
        try {
            const userId = req.params.userId;

            const user = await User.findOne({
                where: {
                    id: userId,
                },
            });
            return res.status(http_status_codes.StatusCodes.OK).json(user);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one User ",
                    err: error,
                });
        }
    },
    async UserBlock (req, res, next) {
        try {
            const userId = req.params.userId;

            const user = await User.findOne({
                where: {
                    id: userId,
                },
                attributes: ['isBlocked'],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(user);
        } catch (error) {
            return res
                .status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    error: "error occurred in get one User ",
                    err: error,
                });
        }
    },
    async forgotPassword(req, res) {
        const {
            email,
        } = req.body;

        const user = await User .findOne({
            where: {
                email: email
            }
        });

        if (user) {
            // send email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'Withlove.ksa1@gmail.com',
                    pass: 'Besh123!'
                }
            });

            var rand = Math.floor(100000 + Math.random() * 900000);

            var mailOptions = {
                from: ' ', // sender address
                to: email, // list of receivers
                subject: 'User Password Verification Code', // Subject line
                text: 'Here is a code to setup your password again', // plain text body
                html: 'Hi Dear User <br>Please verify your email using the link below and get back your password! <b style="font-size:24px;margin-left:30px"> Your code - ' + rand + '<b>' // html body

            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res
                        .status(http_status_codes.StatusCodes.CONFLICT)
                        .json({
                            error: "Error occurred while sending Verification Code",
                            err: error,
                        });
                } else {
                    return res.json({
                        user: user,
                        verificationCode: rand
                    });
                }
            });

        } else {
            return res
                .status(http_status_codes.StatusCodes.UNAUTHORIZED)
                .json({ error: "Email does not exist" });
        }

    },
    async blockUser(req, res, next) {

        try {
            const userId = req.params.userId;
            const {
                isBlocked
            } = req.body;

            const blockUser = await User.update({
                isBlocked: isBlocked,
            }, {
                where: {
                    id: userId,
                }
            });

            return res
                .status(http_status_codes.StatusCodes.OK)
                .json({
                    message:
                        isBlocked ?
                            'User blocked successfully!' : 'User unblocked successfully!'
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