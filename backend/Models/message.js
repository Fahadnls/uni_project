module.exports = (sequelize, type) => {
    return sequelize.define("message", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        isAdmin: type.BOOLEAN,
        messageBody: type.TEXT,
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false,
        }
    });
};