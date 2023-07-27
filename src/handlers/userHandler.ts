import { Socket } from 'socket.io';
import { User } from '../types';
import { users } from '../storage';

export const registerUser = (socket: Socket, username: string) => {
  const user: User = {
    id: socket.id,
    username: username,
    currentRoom: null,
  };
  users[socket.id] = user;
  console.log(`Пользователь ${user.username} зарегистрирован`);
};