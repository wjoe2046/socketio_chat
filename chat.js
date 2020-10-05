const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

// io.on = io.of('/admin').on

io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'welcome to the socket io server' });
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient);
  });
  socket.on('newMessageToServer', (msg) => {
    console.log(msg);
    io.emit('messageToClients', { text: msg.text });
  });

  setTimeout(() => {
    io.of('/admin').emit(
      'welcome',
      'Welcome to the admin channel, from the main channel!'
    );
  }, 2000);
});

io.of('/admin').on('connection', (socket) => {
  console.log('someone connected to the admin space');
  io.of('/admin').emit('welcome', 'welcome to the admin channel!');
});
