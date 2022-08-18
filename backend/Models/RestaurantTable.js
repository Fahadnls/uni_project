module.exports = (sequelize, type) => {
    return sequelize.define("restaurant_table", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        tableNumber: type.STRING,
        seatingCapacity: type.INTEGER,
    });
};
