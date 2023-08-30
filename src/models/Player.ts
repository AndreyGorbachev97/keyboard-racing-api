export class Player {
  id: string;
  text: string = '';
  statusGame: 'progress' | 'finished' | 'wait' = 'wait';
  speed: number = 0;
  numberErrors: number = 0;
  username: string = '';

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
  }
}