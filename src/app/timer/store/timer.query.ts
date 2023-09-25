import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {TimerState, TimerStore} from "./timer.store";


@Injectable({
  providedIn: 'root'
})
export class TimerQuery extends QueryEntity<TimerState> {

  // @ts-ignore
  constructor(protected store: TimerStore) {
    super(store);
  }

  selectAllTimers() {
    return this.selectAll();
  }
}
