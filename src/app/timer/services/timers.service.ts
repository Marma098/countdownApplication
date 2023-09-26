import { Injectable } from '@angular/core';
import { Timer } from '../models/timer.model';
import { TimerStore } from '../store/timer.store';
import { v4 as uuid } from 'uuid';
import { Duration } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TimersService {
  private readonly store: TimerStore;

  constructor(timerStore: TimerStore) {
    this.store = timerStore;
  }

  public createTimer(
    name: string,
    duration: Duration,
    timeInSeconds: number,
    paused?: boolean
  ) {
    const timer: Timer = {
      id: uuid(),
      name: name,
      duration: duration,
      paused: paused ?? false,
      timeInSeconds: timeInSeconds,
    };
    this.store.createTimer(timer);
  }

  public updateTimer(timer: Timer) {
    this.store.updateTimer(timer);
  }
}
