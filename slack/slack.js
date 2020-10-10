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
  io.of(namespace.endPoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endPoint}`);
    //a socket has connected to one of chatgroup namespaces; send ns group info back
    nsSocket.emit(`nsRoomLoad`, namespaces[0].rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      nsSocket.join(roomToJoin);
      io.of('/wiki')
        .in(roomToJoin)
        .clients((error, clients) => {
          console.log(clients.length);
          numberOfUsersCallback(clients.length);
        });
    });
    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg,
        time: Date.now(),
        username: 'rbunch',
        avatar: 'https://via.placeholder.com/30',
      };
      console.log(fullMsg);
      console.log(nsSocket.rooms);
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});
