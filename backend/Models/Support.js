module.exports = (sequelize, type) => {
    return sequelize.define("support", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        subject: type.STRING,
        message: type.STRING,
        email: type.STRING,
        
    });
};
