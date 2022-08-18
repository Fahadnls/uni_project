module.exports = (sequelize, type) => {
    return sequelize.define("user", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        fullName: type.STRING,
        email: type.STRING,
        password: type.STRING,
        profileImage: type.STRING,
        phoneNumber: type.STRING,
        isBlocked: {
            type: type.BOOLEAN,
            defaultValue: false,
        }
    });
};

