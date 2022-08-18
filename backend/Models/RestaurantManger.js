module.exports = (sequelize, type) => {
    return sequelize.define("restaurant_manger", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        fullName: type.STRING,
        email: type.STRING,
        password: type.STRING,
        isBlocked: {
            type: type.BOOLEAN,
            defaultValue: false,
        },
        isAdmin: {
            type: type.BOOLEAN,
            defaultValue: false,
        },
        assignRestaurant: {
            type: type.BOOLEAN,
            defaultValue: false,
        }
    });
};
