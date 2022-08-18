module.exports = function (io) {

  io.on('connection', socket => {

    socket.on('join_chat', params => {
      socket.join(params.room1);
      socket.join(params.room2);
    });

    socket.on('refresh', data => {
      io.emit('listenchat' + data.userId, data);
    });
    socket.on('refreshReservation', data => {
      io.emit('Reservation' + data.restaurantId, data);
    });

    socket.on('IReceivedMessage', data => {
      io.emit('IsMessageReceived' + data.userId, data);
    });

    socket.on('messageDeleted', data => {
      io.emit('isMessagedDeleted' + data.userId, data);
    });

  });
};