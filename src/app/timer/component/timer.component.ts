import { Component, OnDestroy, OnInit } from '@angular/core';
import { Timer } from '../models/timer.model';
import { interval, Observable, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { TimersService } from '../services/timers.service';
import { TimerQuery } from '../store/timer.query';
import { LocalStorageService } from '../services/localStorage.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {
  public timerName = '';
  public timerTime = '';
  public timerDate = '';
  public timers: Timer[] = [];
  public timers$: Observable<Timer[]>;
  private subscription = new Subject();

  constructor(
    private timerService: TimersService,
    private timerQuery: TimerQuery,
    private localStorageService: LocalStorageService
  ) {
    this.loadCachedTimers();
    this.timers$ = this.timerQuery.selectAllTimers();
    this.timers$.subscribe((value) => {
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
    const formattedFullTime = moment(mergeTimeAndDate).format(
      'MM DD YYYY HH:mm:ss'
    );
    const remainingTime = moment(formattedFullTime).diff(new Date(), 'seconds');
    if (!isNaN(remainingTime) && remainingTime > 0) {
      this.timerService.createTimer(this.timerName, remainingTime);
    } else {
      console.warn('Could´t create countdown timer');
    }
  }

  private runCountdown() {
    this.timers.forEach((timer: Timer, index: number) => {
      if (!timer.paused) {
        const timer: Timer = {
          id: this.timers[index].id,
          name: this.timers[index].name,
          paused: this.timers[index].paused,
          seconds: this.timers[index].seconds - 1,
        };
        this.timerService.updateTimer(timer);
      }
    });
  }

  public secondsToHms(input: number) {
    const hours = Math.floor(input / 3600);
    const minutes = Math.floor((input % 3600) / 60);
    const seconds = Math.floor((input % 3600) % 60);

    const hDisplay =
      hours > 0 ? hours + (hours == 1 ? ' hour, ' : ' hours, ') : '';
    const mDisplay =
      minutes > 0 ? minutes + (minutes == 1 ? ' minute, ' : ' minutes, ') : '';
    const sDisplay =
      seconds > 0 ? seconds + (seconds == 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
  }

  public pauseTimer(timer: Timer) {
    const updatedTimer = { ...timer };
    updatedTimer.paused = !updatedTimer.paused;
    this.timerService.updateTimer(updatedTimer);
  }

  private loadCachedTimers() {
    const cachedTimers = this.localStorageService.loadData('timerValues');
    if (cachedTimers !== null) {
      this.timers = cachedTimers;
      this.timers.forEach((value) => {
        this.timerService.createTimer(value.name, value.seconds, value.paused);
      });
    }
  }

  private saveTimersToLocalStorage() {
    window.addEventListener('beforeunload', () => {
      const dataToSave = this.timers;
      this.localStorageService.saveData('timerValues', dataToSave);
    });
  }
}
