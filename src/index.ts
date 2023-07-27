import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import {rooms, users} from './storage';
import { createRoom, joinRoom, leaveRoom, registerUser } from './handlers';
import { User } from './types';

const app = express();
const httpServer = app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});

// Настройка CORS для Express
app.use(cors());

const io: Server = new Server(httpServer, {
  cors: {
    origin: ['http://example.com', 'http://localhost:8080'],
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket: any) => {
  console.log('Новый клиент подключился');

  // todo временное решение
  const user: User = {
    id: socket.id,
    username: 'Kek Kekovich',
    currentRoom: null,
  };
  users[socket.id] = user;
  console.log(`Пользователь ${user.username} зарегистрирован`);

  // Обработчик события регистрации пользователя
  socket.on('registerUser', (username: string) => {
    registerUser(socket, username);
  });

  // Обработчик события получения списка комнат
  socket.on('getRooms', () => {
    // Отправляем список комнат обратно клиенту
    socket.emit('roomsList', Object.keys(rooms));
  });
  
  // создание комнаты
  socket.on('createRoom', (roomName: string) => {
    createRoom(io, socket, roomName);
  });

  // вход в комнату
  socket.on('joinRoom', (roomName: string) => {
    joinRoom(io, socket, roomName);
  });

  // выход из комнаты
  socket.on('leaveRoom', () => {
    leaveRoom(socket);
  });

  socket.on('message', (message: string) => {
    console.log('Получено сообщение:', message);

    io.to(socket.roomName).emit('message', `Клиент сказал: ${message}`);
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    const roomName = user.currentRoom;
    // чистка комнаты от пользователя
    if (roomName) {
      const room = rooms[roomName];
      if (room) {
        room.players = room.players.filter(player => player.id !== socket.id);
        if (room.players.length === 0) {
          delete rooms[roomName];
        }
      }
      delete users[socket.id];
    }
  });
});