module.exports = (sequelize, type) => {
    return sequelize.define("restaurant", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        title: type.STRING,
        description: type.TEXT,
        policy: type.TEXT,
        promotionalText: type.STRING,
        mainLogo: type.STRING,
        openingTime: type.STRING,
        closingTime: type.STRING,
        seatingArea: type.STRING,
        latitude: type.FLOAT,
        longitude: type.FLOAT,
        location: type.STRING,
        type: type.STRING,
        isSpecialEventSupport: {
            type: type.BOOLEAN,
            default: false,
        },

    });
};
