let io;
exports.socketConnection = (server) => {
   io = require('socket.io')(server);
   io.on("connection", socket => {
      console.log('Client connected to socket io on server');
      socket.on('disconnect', () => console.log('Client disconnected to socket io on server'));
      // need to listen to database when new orders get sent to it
   
      // when a new order gets sent emit a message to the connected client
      // single client that connects
      // socket.emit('order', 'watching for orders');
   
      // emits to everyone except the user that is connecting
      // socket.broadcast.emit();
   
      // all clients in general
      // io.emit()
   });
}
exports.sendOrder = (change) => io.emit('order-change', change.fullDocument)