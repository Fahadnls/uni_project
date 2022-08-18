module.exports = (sequelize, type) => {
    return sequelize.define("restaurant_menu", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        title: type.STRING,
    });
};