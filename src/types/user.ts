export interface User {
  id: string;
  username: string;
  currentRoom: string | null;
}

export interface Users { [key: string]: User }