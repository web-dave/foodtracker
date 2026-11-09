import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <button (click)="previousMonth()" class="nav-btn">← Zurück</button>
        <h2>{{ monthName() }} {{ currentYear() }}</h2>
        <button (click)="nextMonth()" class="nav-btn">Weiter →</button>
      </div>

      <div class="view-toggle">
        <button
          [class.active]="viewMode() === 'month'"
          (click)="setViewMode('month')"
          class="toggle-btn"
        >
          📅 Monat
        </button>
        <button
          [class.active]="viewMode() === 'week'"
          (click)="setViewMode('week')"
          class="toggle-btn"
        >
          📆 Woche
        </button>
      </div>

      <!-- Month View -->
      <div *ngIf="viewMode() === 'month'" class="calendar-grid">
        <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
        <div *ngFor="let date of calendarDates()" class="calendar-date">
          <button
            (click)="selectDate(date)"
            [class.other-month]="date.getMonth() !== currentDate().getMonth()"
            [class.selected]="isSelectedDate(date)"
            [class.today]="isToday(date)"
            class="date-btn"
          >
            {{ date.getDate() }}
          </button>
        </div>
      </div>

      <!-- Week View -->
      <div *ngIf="viewMode() === 'week'" class="week-view">
        <div class="week-navigation">
          <button (click)="previousWeek()" class="nav-btn">← Zurück</button>
          <span class="week-range">{{ getWeekRange() }}</span>
          <button (click)="nextWeek()" class="nav-btn">Weiter →</button>
        </div>

        <div class="week-grid">
          <div *ngFor="let date of weekDates()" class="week-day">
            <button
              (click)="selectDate(date)"
              [class.selected]="isSelectedDate(date)"
              [class.today]="isToday(date)"
              class="week-date-btn"
            >
              <div class="weekday-name">{{ getWeekDayName(date) }}</div>
              <div class="date">{{ date.getDate() }}</div>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="selectedDate()" class="selected-date-display">
        <p>
          Ausgewählter Tag:
          <strong>{{ formatDate(selectedDate()!) }}</strong>
        </p>
        <button (click)="viewDetails()" class="btn btn-primary">
          📊 Details anzeigen
        </button>
      </div>
    </div>
  `,
  styles: `
    .calendar-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: #fafafa;
      max-width: 600px;
      margin: 0 auto;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 20px;
        color: #333;
        min-width: 200px;
        text-align: center;
      }
    }

    .nav-btn {
      padding: 8px 16px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #1976D2;
      }
    }

    .view-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;

      .toggle-btn {
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;

        &:hover {
          border-color: #2196F3;
        }

        &.active {
          background: #2196F3;
          color: white;
          border-color: #2196F3;
        }
      }
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }

    .weekday {
      text-align: center;
      font-weight: 600;
      color: #666;
      padding: 8px 0;
      font-size: 12px;
    }

    .calendar-date {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .date-btn {
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background: #f0f0f0;
        border-color: #2196F3;
      }

      &.today {
        background: #e3f2fd;
        border-color: #2196F3;
        font-weight: 600;
        color: #2196F3;
      }

      &.selected {
        background: #2196F3;
        color: white;
        border-color: #2196F3;
      }

      &.other-month {
        color: #ccc;
        background: #f9f9f9;
      }
    }

    .week-view {
      margin-bottom: 20px;
    }

    .week-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .week-range {
        font-weight: 500;
        color: #333;
      }
    }

    .week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .week-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week-date-btn {
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: #f0f0f0;
        border-color: #2196F3;
      }

      &.today {
        background: #e3f2fd;
        border-color: #2196F3;

        .date {
          color: #2196F3;
          font-weight: 600;
        }
      }

      &.selected {
        background: #2196F3;
        color: white;
        border-color: #2196F3;

        .date {
          color: white;
          font-weight: 600;
        }
      }

      .weekday-name {
        font-size: 12px;
        color: #999;
      }

      .date {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .selected-date-display {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
      text-align: center;

      p {
        margin: 0 0 12px 0;
        color: #333;

        strong {
          color: #2196F3;
        }
      }

      .btn {
        padding: 8px 16px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          background: #1976D2;
        }
      }
    }

    @media (max-width: 600px) {
      .calendar-header {
        flex-direction: column;
        gap: 12px;
      }

      .calendar-grid {
        gap: 4px;
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
