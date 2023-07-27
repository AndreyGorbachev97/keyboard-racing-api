export interface Player {
  id: string;
  text: string;
  statusGame: 'progress' | 'finished' | 'wait';
  speed: number;
  numberErrors: number;
}
