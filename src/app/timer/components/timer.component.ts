import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timer } from '../models/timer.model';
import { interval, Observable, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { now } from 'moment';
import { TimersService } from '../services/timers.service';
import { TimerQuery } from '../store/timer.query';
import { LocalStorageService } from '../services/localStorage.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit, OnDestroy {
  public timerName = '';
  public timerTime = '';
  public timerDate = '';
  public timers: Timer[] = [];
  public timers$: Observable<Timer[]>;
  private subscription = new Subject<boolean>();

  constructor(
    private readonly timerService: TimersService,
    private readonly timerQuery: TimerQuery,
    private readonly localStorageService: LocalStorageService
  ) {
    this.loadCachedTimers();
    this.timers$ = this.timerQuery.selectAllTimers();
    this.timers$.pipe(takeUntil(this.subscription)).subscribe((value) => {
      this.timers = value;
    });
  }

  public ngOnInit(): void {
    this.saveTimersToLocalStorage();
    interval(1000)
      .pipe(takeUntil(this.subscription))
      .subscribe(() => {
        this.runCountdown();
      });
  }

  public ngOnDestroy() {
    this.subscription.next(true);
    this.subscription.complete();
  }

  public addTimer() {
    const mergeTimeAndDate = this.timerDate + ' ' + this.timerTime;
    const formattedTime = moment(mergeTimeAndDate).format(
      'MM DD YYYY HH:mm:ss'
    );
    const remainingTime = moment(formattedTime).diff(now(), 'seconds');
    const duration = moment.duration(remainingTime, 'seconds');

    if (!isNaN(remainingTime) && remainingTime > 0) {
      this.timerService.createTimer(
        this.timerName,
        duration,
        remainingTime,
        false
      );
      this.runCountdown();
    } else {
      console.warn('Could´t create countdown timer');
    }
  }

  private runCountdown() {
    this.timers.forEach((timer: Timer) => {
      if (!timer.paused) {
        const time = timer.duration.asMilliseconds();
        let seconds = 0;
        if (time > 1000) {
          seconds = Number(moment(time).subtract(1, 'seconds')) / 1000;
        }
        const duration = moment.duration(seconds, 'seconds');
        const timerToUpdate: Timer = {
          id: timer.id,
          name: timer.name,
          paused: timer.paused,
          duration: duration,
          timeInSeconds: seconds,
        };
        this.timerService.updateTimer(timerToUpdate);
      }
    });
  }

  public pauseTimer(timer: Timer) {
    const updatedTimer = { ...timer };
    updatedTimer.paused = !updatedTimer.paused;
    this.timerService.updateTimer(updatedTimer);
  }

  private loadCachedTimers() {
    const cachedTimers: Timer[] =
      this.localStorageService.loadData('timerValues');
    if (cachedTimers.length !== 0) {
      cachedTimers.forEach((value) => {
        this.timerService.createTimer(
          value.name,
          moment.duration(value.timeInSeconds, 'seconds'),
          value.timeInSeconds,
          value.paused
        );
      });
    }
  }

  private saveTimersToLocalStorage() {
    window.addEventListener('beforeunload', () => {
      this.localStorageService.saveData('timerValues', this.timers);
    });
  }

  public trackTimers(index: number, timer: Timer) {
    return timer.id;
  }
}
