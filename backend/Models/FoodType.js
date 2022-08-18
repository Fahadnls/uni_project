module.exports = (sequelize, type) => {
    return sequelize.define("food_type", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        type: type.STRING,
        icon: type.STRING,
        typeArabic: type.STRING,
        
    });
};
