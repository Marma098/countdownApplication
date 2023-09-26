import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig, EntityState } from '@datorama/akita';
import { Timer } from '../models/timer.model';

export interface TimerState extends EntityState<Timer, string> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'timers' })
export class TimerStore extends EntityStore<TimerState> {
  constructor() {
    super();
  }

  public createTimer(timer: Timer) {
    this.add(timer);
  }

  public updateTimer(timer: Timer) {
    this.update(timer.id, timer);
  }
}
