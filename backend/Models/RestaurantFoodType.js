module.exports = (sequelize, type) => {
    return sequelize.define("restaurant_food_type", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        
        
    });
};
