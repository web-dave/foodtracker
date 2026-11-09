import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StorageService } from '../../services/storage.service';
import { Entry } from '../../models/entries';
import { DayDetailsDialogComponent } from './day-details-dialog.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
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
                <span class="toggle-label">Monat</span>
              </mat-button-toggle>
              <mat-button-toggle value="week">
                <mat-icon>view_week</mat-icon>
                <span class="toggle-label">Woche</span>
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <!-- Month View -->
          @if (viewMode() === 'month') {
            <div class="month-view">
              <!-- Day headers -->
              <div class="day-header">So</div>
              <div class="day-header">Mo</div>
              <div class="day-header">Di</div>
              <div class="day-header">Mi</div>
              <div class="day-header">Do</div>
              <div class="day-header">Fr</div>
              <div class="day-header">Sa</div>

              <!-- Calendar days -->
              @for (date of monthDays(); track date.getTime()) {
                <button
                  class="calendar-day"
                  [class.other-month]="!isCurrentMonth(date)"
                  [class.today]="isToday(date)"
                  [class.has-entries]="hasEntries(date)"
                  (click)="openDayDetails(date)"
                  [attr.aria-label]="getDayAriaLabel(date)"
                >
                  <span class="day-number">{{ date.getDate() }}</span>
                  @if (hasEntries(date)) {
                    <div class="entry-indicators">
                      @if (getEntriesForDay(date).some(e => e.type === 'food')) {
                        <span class="indicator food-indicator" title="Essen">🍽️</span>
                      }
                      @if (getEntriesForDay(date).some(e => e.type === 'weight')) {
                        <span class="indicator weight-indicator" title="Gewicht">⚖️</span>
                      }
                      @if (getEntriesForDay(date).some(e => e.type === 'sport')) {
                        <span class="indicator sport-indicator" title="Sport">🏃</span>
                      }
                    </div>
                  }
                </button>
              }
            </div>
          }

          <!-- Week View -->
          @if (viewMode() === 'week') {
            <div class="week-view">
              @for (date of weekDays(); track date.getTime()) {
                <div class="week-day" [class.is-today]="isToday(date)">
                  <div class="week-day-header">
                    <span class="day-name">{{ getDayName(date) }}</span>
                    <span class="day-date">{{ date.getDate() }}</span>
                  </div>
                  <button
                    mat-stroked-button
                    class="week-day-btn"
                    (click)="openDayDetails(date)"
                    [class.has-entries]="hasEntries(date)"
                  >
                    @if (getEntriesForDay(date).length > 0) {
                      <div class="week-entries">
                        @if (getEntriesForDay(date).some(e => e.type === 'food')) {
                          <span class="entry-type-icon">🍽️</span>
                        }
                        @if (getEntriesForDay(date).some(e => e.type === 'weight')) {
                          <span class="entry-type-icon">⚖️</span>
                        }
                        @if (getEntriesForDay(date).some(e => e.type === 'sport')) {
                          <span class="entry-type-icon">🏃</span>
                        }
                      </div>
                    } @else {
                      <span class="no-entries">Leer</span>
                    }
                  </button>
                </div>
              }
            </div>
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
      width: 100%;
      overflow: hidden;

      @media (min-width: 768px) {
        padding: 24px;
      }
    }

    .calendar-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);
      gap: 8px;

      @media (min-width: 768px) {
        padding: 16px;
      }

      h2 {
        margin: 0;
        flex: 1;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        min-width: 150px;

        @media (min-width: 768px) {
          font-size: 20px;
          min-width: auto;
        }
      }

      button {
        padding: 4px;

        @media (min-width: 768px) {
          padding: 8px;
        }
      }
    }

    mat-card-content {
      padding: 12px;

      @media (min-width: 768px) {
        padding: 20px;
      }
    }

    .view-toggle {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;

      @media (min-width: 768px) {
        margin-bottom: 24px;
      }

      mat-button-toggle-group {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .toggle-label {
        display: none;

        @media (min-width: 500px) {
          display: inline;
          margin-left: 4px;
        }
      }

      mat-button-toggle {
        min-width: 40px;
        padding: 4px;

        @media (min-width: 500px) {
          min-width: 80px;
          padding: 8px 12px;
        }
      }
    }

    /* Month View - Responsive */
    .month-view {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      width: 100%;
      overflow: hidden;

      @media (min-width: 500px) {
        gap: 6px;
      }

      @media (min-width: 768px) {
        gap: 12px;
      }
    }

    .day-header {
      text-align: center;
      font-weight: 600;
      color: #666;
      padding: 4px 2px;
      font-size: 10px;
      line-height: 1.2;

      @media (min-width: 500px) {
        padding: 6px;
        font-size: 11px;
      }

      @media (min-width: 768px) {
        font-size: 12px;
        padding: 8px;
      }
    }

    .calendar-day {
      aspect-ratio: 1;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 2px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 1px;
      font-size: 10px;
      color: #333;
      position: relative;
      min-width: 0;
      overflow: hidden;

      @media (min-width: 500px) {
        padding: 3px;
        gap: 2px;
        font-size: 11px;
        border-radius: 6px;
        border-width: 1.5px;
      }

      @media (min-width: 768px) {
        font-size: 12px;
        padding: 6px;
        gap: 3px;
        border-radius: 8px;
        border-width: 2px;
      }

      &:hover:not(.other-month) {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.15);
      }

      &:active:not(.other-month) {
        transform: scale(0.98);
      }

      &.other-month {
        opacity: 0.3;
        background: #f9f9f9;
        cursor: default;
      }

      &.today {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 100%);
        border-color: #667eea;
        font-weight: 600;
        color: #667eea;
      }

      &.has-entries {
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%);
        border-color: #43e97b;
      }

      .day-number {
        font-weight: 600;
        line-height: 1;
      }

      .entry-indicators {
        display: flex;
        gap: 1px;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;

        @media (min-width: 500px) {
          gap: 2px;
        }
      }

      .indicator {
        font-size: 8px;
        line-height: 1;

        @media (min-width: 500px) {
          font-size: 9px;
        }

        @media (min-width: 768px) {
          font-size: 10px;
        }
      }
    }

    /* Week View */
    .week-view {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      width: 100%;

      @media (min-width: 500px) {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      }

      @media (min-width: 768px) {
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
      }
    }

    .week-day {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;

      @media (min-width: 768px) {
        gap: 8px;
      }

      &.is-today {
        .week-day-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 4px;
        }
      }
    }

    .week-day-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 4px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 3px;
      transition: all 0.2s ease;

      @media (min-width: 500px) {
        padding: 10px 6px;
        border-radius: 4px;
      }

      @media (min-width: 768px) {
        padding: 12px;
        border-radius: 4px;
      }

      .day-name {
        font-size: 10px;
        font-weight: 600;
        color: #666;
        line-height: 1;

        @media (min-width: 768px) {
          font-size: 12px;
        }
      }

      .day-date {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        line-height: 1.2;

        @media (min-width: 768px) {
          font-size: 16px;
        }
      }
    }

    .week-day-btn {
      min-height: 60px;
      border-radius: 6px;
      padding: 8px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 11px;
      width: 100%;

      @media (min-width: 500px) {
        min-height: 70px;
        padding: 10px;
        font-size: 12px;
      }

      @media (min-width: 768px) {
        min-height: 80px;
        padding: 12px;
        font-size: 13px;
      }

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        background: rgba(102, 126, 234, 0.05);
      }

      &.has-entries {
        border-color: #43e97b;
        background: linear-gradient(135deg, rgba(67, 233, 123, 0.08) 0%, rgba(56, 249, 215, 0.05) 100%);
      }

      .week-entries {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;

        @media (min-width: 500px) {
          gap: 8px;
        }

        @media (min-width: 768px) {
          gap: 10px;
        }
      }

      .entry-type-icon {
        font-size: 18px;
        line-height: 1;

        @media (min-width: 500px) {
          font-size: 20px;
        }

        @media (min-width: 768px) {
          font-size: 22px;
        }
      }

      .no-entries {
        color: #999;
        font-style: italic;
      }
    }

    @media (max-width: 400px) {
      .calendar-container {
        padding: 8px;
      }

      mat-card-content {
        padding: 8px;
      }

      .calendar-day {
        font-size: 9px;

        .indicator {
          font-size: 7px;
        }
      }

      .day-header {
        font-size: 9px;
        padding: 3px 1px;
      }
    }
  `,
})
export class CalendarComponent {
  private dialog = inject(MatDialog);
  private storageService = inject(StorageService);

  currentDate = signal(new Date());
  viewMode = signal<'month' | 'week'>('week');

  monthName = computed(() => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ];
    return months[this.currentDate().getMonth()];
  });

  currentYear = computed(() => this.currentDate().getFullYear());

  monthDays = computed(() => {
    const date = new Date(this.currentDate());
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  });

  weekDays = computed(() => {
    const today = new Date(this.currentDate());
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay;
    const monday = new Date(today.setDate(diff));

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(day.getDate() + i);
      days.push(day);
    }

    return days;
  });

  previousMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() - 1);
    this.currentDate.set(date);
  }

  nextMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() + 1);
    this.currentDate.set(date);
  }

  setViewMode(mode: 'month' | 'week'): void {
    this.viewMode.set(mode);
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate().getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getDayName(date: Date): string {
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return days[date.getDay()];
  }

  hasEntries(date: Date): boolean {
    return this.getEntriesForDay(date).length > 0;
  }

  getEntriesForDay(date: Date): Entry[] {
    const entries = this.storageService.getEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  }

  getDayTooltip(date: Date): string {
    const entries = this.getEntriesForDay(date);
    if (entries.length === 0) {
      return 'Keine Einträge';
    }
    const foodCount = entries.filter(e => e.type === 'food').length;
    const weightCount = entries.filter(e => e.type === 'weight').length;
    const sportCount = entries.filter(e => e.type === 'sport').length;

    const parts: string[] = [];
    if (foodCount > 0) parts.push(`${foodCount} Essen`);
    if (weightCount > 0) parts.push(`${weightCount} Gewicht`);
    if (sportCount > 0) parts.push(`${sportCount} Sport`);

    return parts.join(', ');
  }

  getDayAriaLabel(date: Date): string {
    const dateStr = date.toLocaleDateString('de-DE');
    const entries = this.getEntriesForDay(date);
    if (entries.length === 0) {
      return `${dateStr}, keine Einträge`;
    }
    return `${dateStr}, ${entries.length} Einträge`;
  }

  openDayDetails(date: Date): void {
    if (!this.isCurrentMonth(date)) {
      return;
    }

    const entries = this.getEntriesForDay(date);
    this.dialog.open(DayDetailsDialogComponent, {
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: {
        date,
        entries,
      },
      panelClass: 'day-details-dialog',
    });
  }
}
