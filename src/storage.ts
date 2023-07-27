import { Room } from "./models/Room";
import { User, Users } from "./types";
import { Player } from "./types/player";

export const rooms: { [roomId: string]: Room } = {};
export const users: { [userId: string]: User } = {};