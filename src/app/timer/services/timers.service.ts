import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Timer } from '../models/timer.model';
import { TimerStore } from '../store/timer.store';
import { v4 as uuid } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class TimersService {
  private readonly store: TimerStore;
  public timersHaveChanged = new Subject();

  constructor(timerStore: TimerStore) {
    this.store = timerStore;
  }

  public createTimer(name: string, time: number, paused?: boolean) {
    const timer: Timer = {
      id: uuid(),
      name: name,
      seconds: time,
      paused: paused ?? false,
    };
    this.timersHaveChanged.next(true);
    this.store.createTimer(timer);
  }

  public updateTimer(timer: Timer) {
    this.store.updateTimer(timer);
  }
}
