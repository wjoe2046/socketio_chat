function joinNs(endPoint) {
  nsSocket = io(`http://localhost:9000${endPoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';
    nsRooms.forEach((room) => {
      let glyph = room.privateRoom ? 'lock' : 'globe';

      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });

    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach((ele) => {
      ele.addEventListener('click', (e) => {
        console.log('someone clicked on', e.target.innerText);
      });
    });

    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    // console.log(topRoomName);
    joinRoom(topRoomName);
  });

  nsSocket.on('messageToClients', (msg) => {
    console.log(msg);
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
  });

  document
    .querySelector('.message-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const newMessage = document.querySelector('#user-message').value;
      nsSocket.emit('newMessageToServer', { text: newMessage });
    });
}
