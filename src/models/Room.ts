import { Player } from "../types/player";

export class Room {
  creatorId: string;
  status: 'started' | 'wait' | 'stop' = 'wait';
  sampleText: string;
  players: Player[] = [];

  constructor(creatorId: string, sampleText: string) {
    this.creatorId = creatorId;
    this.sampleText = sampleText;
  }
}