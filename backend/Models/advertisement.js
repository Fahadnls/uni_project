module.exports = (sequelize, type) => {
    return sequelize.define("advertisement", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        title: type.STRING,
        image: type.STRING,
        description: type.STRING,
        url: type.TEXT,
    });
};
