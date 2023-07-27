export class Player {
  id: string;
  text: string = '';
  statusGame: 'progress' | 'finished' | 'wait' = 'wait';
  speed: number = 0;
  numberErrors: number = 0;

  constructor(id: string) {
    this.id = id;
  }
}