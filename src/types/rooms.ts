import { Player } from "./player";

export interface Rooms {
  [roomName: string]: {
    creatorId: string;
    status: 'started' | 'wait' | 'stop';
    sampleText: string;
    players: Player[];
  };
}
