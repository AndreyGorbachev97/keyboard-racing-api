import { Server, Socket } from 'socket.io';
import { rooms, users } from '../storage';
import { Room } from '../models';
import { Player } from '../models';

export const createRoom = (io: Server, socket: Socket, roomName: string) => {
  if (rooms[roomName]) {
    socket.emit('error', 'Комната с таким именем уже существует');
    return;
  }

  if (users[socket.id].currentRoom) {
    socket.emit('error', 'Вы уже находитесь в другой комнате');
    return;
  }

  const room = new Room(socket.id, 'Тут ваш текст для игры');
  const player = new Player(socket.id, users[socket.id].username);
  rooms[roomName] = room;
  rooms[roomName].players.push(player);
  console.log('users2', users);
  console.log('id', socket.id);
  // добавляем пользователю текущую комнату
  users[socket.id].currentRoom = roomName;
  socket.join(roomName);
  // Добавляем комнату в список
  socket.emit('roomCreated', `Комната ${roomName} успешно создана`);
  // Отправляем список комнат всем клиентам
  io.emit('roomsList', rooms);
  // Отправляем всем кто в комнате информацию о комнате
  io.to(roomName).emit('lobby', rooms[roomName]);
};

export const joinRoom = (io: Server, socket: any, roomName: string) => {
  if (!rooms[roomName]) {
    socket.emit('error', `Комната ${roomName} не существует`);
    return;
  }

  if (rooms[roomName].players.length >= 5) {
    socket.emit('error', `Комната ${roomName} заполнена`);
    return;
  }

  if (users[socket.id].currentRoom) {
    socket.emit('error', 'Вы уже находитесь в другой комнате');
    return;
  }

  socket.join(roomName);

  const player = new Player(socket.id, users[socket.id].username);
  rooms[roomName].players.push(player);
  users[socket.id].currentRoom = roomName;
  console.log(`Клиент присоединился к комнате ${roomName}`);

  socket.emit('roomJoined', `Вы успешно вошли в комнату ${roomName}`);
  // Отправляем список комнат всем клиентам
  io.emit('roomsList', rooms);
  // Обработчик события отправки сообщения от клиента
  socket.on('sendMessage', (message: string) => {
    // тут нужно будет сохранять статистику
    // ...
    // Отправляем сообщение всем клиентам в данной комнате, включая отправителя
    io.to(roomName).emit('receiveMessage', message);
  });
};

export const leaveRoom = (io: Server, socket: Socket) => {
  const user = users[socket.id];
  if (!user.currentRoom) {
    socket.emit('error', 'Вы не находитесь в комнате');
    return;
  }

  const room = rooms[user.currentRoom];
  socket.leave(user.currentRoom);
  room.players = room.players.filter(player => player.id !== socket.id);
  console.log(`Клиент покинул комнату ${user.currentRoom}`);
  if (room.players.length === 0) {
    delete rooms[user.currentRoom];
  }
  user.currentRoom = null;
  io.emit('roomsList', rooms);
  socket.emit('roomLeft', 'Вы успешно покинули комнату');
};