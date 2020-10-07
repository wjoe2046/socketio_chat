const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endPoint: ns.endPoint,
    };
  });

  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endPoint).on('connection', (socket) => {
    console.log(`${socket.id} has joined ${namespace.endPoint}`);
  });
});
