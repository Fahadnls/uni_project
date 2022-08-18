module.exports = (sequelize, type) => {
    return sequelize.define("feedback", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        rateCount: type.DOUBLE,
        rating: type.DOUBLE,
    });
};