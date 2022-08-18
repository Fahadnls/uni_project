module.exports = (sequelize, type) => {
    return sequelize.define("reservation", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        slotForm: type.DATE,
        slotTo: type.DATE,
        reservationDate: type.DATE,
        tableBookingCode: type.STRING,
        status: type.STRING,
        cancelReason: type.STRING,
        cancelBy: type.STRING,
        additionalNote: type.STRING,
        seatingArea: type.STRING,
        seats: type.INTEGER,
        feedback: type.STRING,
        rating: {
            type: type.INTEGER,
            defaultValue: 0,
        },
    });
};
