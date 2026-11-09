import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="calendar-container">
      <mat-card class="calendar-card">
        <mat-card-header class="calendar-header">
          <button mat-icon-button (click)="previousMonth()" matTooltip="Vorheriger Monat">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <h2>{{ monthName() }} {{ currentYear() }}</h2>
          <button mat-icon-button (click)="nextMonth()" matTooltip="Nächster Monat">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </mat-card-header>

        <mat-card-content>
          <!-- View Toggle -->
          <div class="view-toggle">
            <mat-button-toggle-group
              [value]="viewMode()"
              (change)="setViewMode($event.value)"
              appearance="standard"
            >
              <mat-button-toggle value="month">
                <mat-icon>calendar_month</mat-icon>
                Monat
              </mat-button-toggle>
              <mat-button-toggle value="week">
                <mat-icon>view_week</mat-icon>
                Woche
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <!-- Month View -->
          @if (viewMode() === 'month') {
            <div class="calendar-grid">
              @for (day of weekDays; track day) {
                <div class="weekday">{{ day }}</div>
              }
              @for (date of calendarDates(); track date.getTime()) {
                <button
                  mat-raised-button
                  (click)="selectDate(date)"
                  [class.other-month]="date.getMonth() !== currentDate().getMonth()"
                  [class.selected]="isSelectedDate(date)"
                  [class.today]="isToday(date)"
                  class="date-btn"
                >
                  {{ date.getDate() }}
                </button>
              }
            </div>
          }

          <!-- Week View -->
          @if (viewMode() === 'week') {
            <div class="week-container">
              <div class="week-navigation">
                <button mat-icon-button (click)="previousWeek()" matTooltip="Vorherige Woche">
                  <mat-icon>chevron_left</mat-icon>
                </button>
                <span class="week-range">{{ getWeekRange() }}</span>
                <button mat-icon-button (click)="nextWeek()" matTooltip="Nächste Woche">
                  <mat-icon>chevron_right</mat-icon>
                </button>
              </div>

              <div class="week-grid">
                @for (date of weekDates(); track date.getTime()) {
                  <button
                    mat-raised-button
                    (click)="selectDate(date)"
                    [class.selected]="isSelectedDate(date)"
                    [class.today]="isToday(date)"
                    class="week-date-btn"
                  >
                    <div class="weekday-name">{{ getWeekDayName(date) }}</div>
                    <div class="date-number">{{ date.getDate() }}</div>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Selected Date Display -->
          @if (selectedDate()) {
            <mat-card class="selected-date-card">
              <mat-card-content>
                <div class="selected-date-content">
                  <span class="selected-label">Ausgewählter Tag:</span>
                  <span class="selected-date">{{ formatDate(selectedDate()!) }}</span>
                </div>
                <button
                  mat-raised-button
                  color="accent"
                  (click)="viewDetails()"
                  class="details-btn"
                >
                  <mat-icon>info</mat-icon>
                  Details anzeigen
                </button>
              </mat-card-content>
            </mat-card>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .calendar-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 12px;
      min-height: 100%;

      @media (min-width: 768px) {
        padding: 24px;
      }
    }

    .calendar-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);

      h2 {
        margin: 0;
        font-size: 24px;
        flex: 1;
        text-align: center;
        color: #333;
      }

      button {
        color: #667eea;

        &:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }
      }
    }

    mat-card-content {
      padding: 20px;
    }

    .view-toggle {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;

      mat-button-toggle-group {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      mat-button-toggle {
        &.mat-button-toggle-checked {
          background-color: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }
      }
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 24px;
    }

    .weekday {
      text-align: center;
      font-weight: 600;
      color: #667eea;
      font-size: 14px;
      padding: 12px 0;
    }

    .date-btn {
      aspect-ratio: 1;
      border-radius: 8px;
      border: 2px solid rgba(0, 0, 0, 0.12);
      background: white;
      color: #333;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(.other-month) {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.05);
      }

      &.other-month {
        color: #ccc;
        cursor: not-allowed;
      }

      &.today {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.15);
        color: #667eea;
        font-weight: 700;
      }

      &.selected {
        background-color: #667eea;
        color: white;
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }

    .week-container {
      margin-bottom: 24px;
    }

    .week-navigation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;

      .week-range {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      button {
        color: #667eea;

        &:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }
      }
    }

    .week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 12px;
    }

    .week-date-btn {
      aspect-ratio: 1;
      border-radius: 8px;
      border: 2px solid rgba(0, 0, 0, 0.12);
      background: white;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 8px;
      text-align: center;

      &:hover {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.05);
      }

      &.today {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.15);

        .date-number {
          color: #667eea;
          font-weight: 700;
        }
      }

      &.selected {
        background-color: #667eea;
        color: white;
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        .date-number {
          color: white;
          font-weight: 700;
        }
      }

      .weekday-name {
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }

      .date-number {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .selected-date-card {
      margin-top: 24px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-left: 4px solid #667eea;

      mat-card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
      }

      .selected-date-content {
        display: flex;
        align-items: baseline;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;

        .selected-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .selected-date {
          font-size: 18px;
          font-weight: 600;
          color: #667eea;
        }
      }

      .details-btn {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    @media (max-width: 600px) {
      .calendar-container {
        padding: 12px;
      }

      .calendar-header {
        flex-direction: column;
        gap: 12px;

        h2 {
          font-size: 20px;
        }
      }

      .calendar-grid {
        gap: 4px;
      }

      .date-btn {
        font-size: 12px;
      }

      .week-grid {
        gap: 8px;
      }

      .week-date-btn {
        font-size: 12px;

        .weekday-name {
          font-size: 10px;
        }

        .date-number {
          font-size: 14px;
        }
      }

      .selected-date-card mat-card-content {
        flex-direction: column;
        align-items: center;
      }

      .selected-date-content {
        flex-direction: column;
      }
    }
  `,
})
export class CalendarComponent {
  private today = new Date();
  currentDate = signal(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
  selectedDate = signal<Date | null>(null);
  viewMode = signal<'month' | 'week'>('month');

  weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  dateSelected = output<Date>();

  currentYear = computed(() => this.currentDate().getFullYear());
  monthName = computed(() => {
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return months[this.currentDate().getMonth()];
  });

  calendarDates = computed(() => {
    const date = new Date(this.currentDate());
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates: Date[] = [];
    let current = new Date(startDate);

    while (current <= lastDay || dates.length < 42) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

  weekDates = computed(() => {
    const date = new Date(this.currentDate());
    const dayOfWeek = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      dates.push(day);
    }

    return dates;
  });

  previousMonth(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }

  nextMonth(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }

  previousWeek(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }

  nextWeek(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    this.dateSelected.emit(date);
  }

  isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;
    return this.isSameDay(date, selected);
  }

  isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  setViewMode(mode: 'month' | 'week'): void {
    this.viewMode.set(mode);
  }

  getWeekDayName(date: Date): string {
    return this.weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
  }

  getWeekRange(): string {
    const dates = this.weekDates();
    const start = dates[0];
    const end = dates[6];
    return `${start.getDate()}. - ${end.getDate()}. ${this.monthName()}`;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  viewDetails(): void {
    if (this.selectedDate()) {
      console.log('Show details for:', this.selectedDate());
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
