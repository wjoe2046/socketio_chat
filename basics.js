//We need http because we don't have express
const http = require('http');
const socketio = require('socket.io');

//We make an http server with node
const server = http.createServer((req, res) => {
  res.end('I am connected');
});

const io = socketio(server);

io.on('connection', (socket, req) => {
  //ws.send became socket.emit
  socket.emit('welcome', 'Welcome to the websocket');
  socket.on('message', (msg) => {
    console.log(msg);
  });
});

server.listen(8000);
