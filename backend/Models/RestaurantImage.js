module.exports = (sequelize, type) => {
    return sequelize.define("restaurant_image", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        imageUrl: type.STRING,
        
    });
};
