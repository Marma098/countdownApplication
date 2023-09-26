import { Injectable } from '@angular/core';
import { Timer } from '../models/timer.model';
import { TimerStore } from '../store/timer.store';
import { v4 as uuid } from 'uuid';
import { Duration } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TimersService {
  constructor(private readonly timerStore: TimerStore) {}

  public createTimer(
    name: string,
    duration: Duration,
    timeInSeconds: number,
    paused: boolean
  ) {
    const timer: Timer = {
      id: uuid(),
      name: name,
      duration: duration,
      timeInSeconds: timeInSeconds,
      paused: paused,
    };
    this.timerStore.createTimer(timer);
  }

  public updateTimer(timer: Timer) {
    this.timerStore.updateTimer(timer);
  }
}
