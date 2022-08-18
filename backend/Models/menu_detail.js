module.exports = (sequelize, type) => {
    return sequelize.define("menu_detail", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        title: type.STRING,
        image: type.STRING,
        price: type.DOUBLE,
    });
};