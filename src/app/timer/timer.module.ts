import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimersService } from './services/timers.service';
import { TimerComponent } from './components/timer.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from './services/localStorage.service';

@NgModule({
  declarations: [TimerComponent],
  imports: [CommonModule, FormsModule],
  exports: [TimerComponent],
  providers: [TimersService, LocalStorageService],
})
export class TimerModule {}
