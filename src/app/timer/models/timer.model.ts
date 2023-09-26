import { Duration } from 'moment';

export interface Timer {
  id: string;
  name: string;
  duration: Duration;
  paused: boolean;
  timeInSeconds?: number;
}
