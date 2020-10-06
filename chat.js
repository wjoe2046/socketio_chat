const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

// io.on = io.of('/admin').on

io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'welcome to the socket io server' });
  socket.on('dataToServer', (dataFromServer) => {
    console.log(dataFromServer);
  });
  socket.join('level1');
  io.of('/')
    .to('level1')
    .emit('joined', `${socket.id} I have joined the level 1 room`);
});

io.of('/admin').on('connection', (socket) => {
  console.log('someone connected to the admin space');
  io.of('/admin').emit('welcome', 'welcome to the admin channel!');
});
