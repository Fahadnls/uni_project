module.exports = (sequelize, type) => {
    return sequelize.define("conversation", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        userId: type.INTEGER,
        messageTime: type.DATE,
        deletedBy: {
            type: type.INTEGER,
            defaultValue: null
        }
    });
};