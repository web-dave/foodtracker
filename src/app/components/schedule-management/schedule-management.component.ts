import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, ScheduleEntryType, DayOfWeek } from '../../models/schedule';
import { AddScheduleDialogComponent } from './add-schedule-dialog.component';

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  template: `
    <div class="schedule-container">
      <div class="schedule-header">
        <h2>📅 Zeitplan verwalten</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openAddScheduleDialog()"
          class="add-btn"
        >
          <mat-icon>add</mat-icon>
          Neuer Zeitplan
        </button>
      </div>

      <div class="schedules-list">
        @if (schedules().length === 0) {
          <mat-card class="empty-state">
            <p>📭 Keine Zeitpläne vorhanden</p>
            <p class="hint">Erstellen Sie einen Zeitplan, um regelmäßige Einträge zu planen</p>
          </mat-card>
        } @else {
          @for (schedule of schedules(); track schedule.id) {
            <mat-card class="schedule-card" [class.disabled]="!schedule.enabled">
              <mat-card-content>
                <div class="schedule-header-row">
                  <div class="schedule-info">
                    <h3 class="schedule-title">
                      {{ getEntryTypeEmoji(schedule.entryType) }}
                      {{ getEntryTypeLabel(schedule.entryType) }}
                    </h3>
                    <div class="schedule-days">
                      @for (day of schedule.daysOfWeek; track day) {
                        <mat-chip>{{ getDayLabel(day) }}</mat-chip>
                      }
                    </div>
                    @if (schedule.time) {
                      <div class="schedule-time">
                        <mat-icon>schedule</mat-icon>
                        {{ schedule.time }}
                      </div>
                    }
                    @if (schedule.notes) {
                      <div class="schedule-notes">
                        📝 {{ schedule.notes }}
                      </div>
                    }
                  </div>
                  <div class="schedule-actions">
                    <button
                      mat-icon-button
                      (click)="toggleEnabled(schedule)"
                      [matTooltip]="schedule.enabled ? 'Deaktivieren' : 'Aktivieren'"
                    >
                      <mat-icon>{{ schedule.enabled ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      (click)="deleteSchedule(schedule.id)"
                      color="warn"
                      matTooltip="Löschen"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .schedule-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 12px;
      min-height: 100%;

      @media (min-width: 768px) {
        padding: 24px;
      }
    }

    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 24px;
        margin: 0;
        font-weight: 500;
      }

      .add-btn {
        gap: 8px;
      }

      @media (max-width: 500px) {
        flex-direction: column;
        gap: 12px;

        h2 {
          font-size: 20px;
        }

        .add-btn {
          width: 100%;
        }
      }
    }

    .schedules-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-left: 4px solid #bdbdbd;

      p {
        font-size: 16px;
        color: #999;
        margin: 0;

        &.hint {
          font-size: 13px;
          margin-top: 8px;
        }
      }
    }

    .schedule-card {
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
      }

      &.disabled {
        opacity: 0.6;
        border-left-color: #bdbdbd;

        mat-card-content {
          color: #999;
        }
      }

      mat-card-content {
        padding: 16px;
      }
    }

    .schedule-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .schedule-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .schedule-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .schedule-days {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      mat-chip {
        height: 28px;
        font-size: 12px;
      }
    }

    .schedule-time {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #667eea;
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .schedule-notes {
      font-size: 13px;
      color: #555;
      padding: 8px 12px;
      background: #f9f9f9;
      border-left: 3px solid #667eea;
      border-radius: 4px;
      margin-top: 4px;
    }

    .schedule-actions {
      display: flex;
      gap: 4px;

      button {
        flex-shrink: 0;
      }
    }

    @media (max-width: 500px) {
      .schedule-header-row {
        flex-direction: column;
      }

      .schedule-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `,
})
export class ScheduleManagementComponent {
  private scheduleService = inject(ScheduleService);
  private dialog = inject(MatDialog);

  schedules = computed(() =>
    this.scheduleService.getSchedules().sort((a, b) => {
      const aIndex = this.dayOrder.indexOf(a.daysOfWeek[0]);
      const bIndex = this.dayOrder.indexOf(b.daysOfWeek[0]);
      return aIndex - bIndex;
    })
  );

  private dayOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  openAddScheduleDialog(): void {
    this.dialog
      .open(AddScheduleDialogComponent, {
        width: '100%',
        maxWidth: '600px',
        panelClass: 'add-schedule-dialog',
      })
      .afterClosed()
      .subscribe((schedule: any) => {
        if (schedule) {
          this.scheduleService.addSchedule(schedule);
        }
      });
  }

  toggleEnabled(schedule: Schedule): void {
    this.scheduleService.updateSchedule(schedule.id, {
      enabled: !schedule.enabled,
    });
  }

  deleteSchedule(id: string): void {
    if (confirm('Möchten Sie diesen Zeitplan wirklich löschen?')) {
      this.scheduleService.deleteSchedule(id);
    }
  }

  getEntryTypeLabel(type: ScheduleEntryType): string {
    const labels: Record<ScheduleEntryType, string> = {
      food: 'Essen',
      weight: 'Gewicht',
      sport: 'Sport',
      'blood-pressure': 'Blutdruck',
    };
    return labels[type];
  }

  getEntryTypeEmoji(type: ScheduleEntryType): string {
    const emojis: Record<ScheduleEntryType, string> = {
      food: '🍽️',
      weight: '⚖️',
      sport: '🏃',
      'blood-pressure': '💉',
    };
    return emojis[type];
  }

  getDayLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      monday: 'Mo',
      tuesday: 'Di',
      wednesday: 'Mi',
      thursday: 'Do',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'So',
    };
    return labels[day];
  }
}
