const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  console.log(socket.handshake);
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
    const username = nsSocket.handshake.query.username;
    //a socket has connected to one of chatgroup namespaces; send ns group info back
    nsSocket.emit(`nsRoomLoad`, namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      // io.of('/wiki')
      //   .in(roomToJoin)
      //   .clients((error, clients) => {
      //     numberOfUsersCallback(clients.length);
      //   });
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      nsSocket.emit('historyCatchUp', nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30',
      };
      console.log(fullMsg);
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });

      nsRoom.addMessage(fullMsg);
      io.of(namespace.endPoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  //Send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endPoint)
    .in(roomToJoin)
    .clients((error, client) => {
      io.of(namespace.endPoint)
        .in(roomToJoin)
        .emit('updateMembers', client.length);
    });
}
