import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ScheduleEntryType, DayOfWeek } from '../../models/schedule';

@Component({
  selector: 'app-add-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <h2 mat-dialog-title>📅 Neuer Zeitplan</h2>
    <mat-dialog-content>
      <mat-card class="form-card">
        <mat-card-content>
          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Aktivität</mat-label>
              <mat-select [(ngModel)]="entryType">
                <mat-option value="food">🍽️ Essen</mat-option>
                <mat-option value="weight">⚖️ Gewicht</mat-option>
                <mat-option value="sport">🏃 Sport</mat-option>
                <mat-option value="blood-pressure">💉 Blutdruck</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-group">
            <label class="form-label">Tage</label>
            <div class="days-grid">
              @for (day of allDays; track day) {
                <mat-checkbox
                  [(ngModel)]="selectedDays[day]"
                  class="day-checkbox"
                >
                  {{ getDayLabel(day) }}
                </mat-checkbox>
              }
            </div>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Uhrzeit (optional)</mat-label>
              <input matInput [(ngModel)]="time" type="time" placeholder="HH:mm" />
            </mat-form-field>
          </div>

          <div class="form-group">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notizen (optional)</mat-label>
              <input
                matInput
                [(ngModel)]="notes"
                type="text"
                placeholder="z.B. Morgens, Nach dem Sport..."
              />
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
      <button
        mat-raised-button
        color="primary"
        (click)="addSchedule()"
        [disabled]="!isValid()"
      >
        <mat-icon>add</mat-icon>
        Hinzufügen
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content {
      padding: 16px 0;
      min-width: 280px;
      max-width: 600px;
    }

    h2 {
      margin: 0 0 16px 0;
    }

    .form-card {
      box-shadow: none;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    mat-card-content {
      padding: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .full-width {
      width: 100%;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 8px;

      @media (max-width: 400px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .day-checkbox {
      display: flex;
      align-items: center;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
      margin-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }
  `,
})
export class AddScheduleDialogComponent {
  private dialogRef = inject(MatDialogRef<AddScheduleDialogComponent>);

  entryType = signal<ScheduleEntryType>('weight');
  selectedDays: Record<DayOfWeek, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };
  time = signal<string>('');
  notes = signal<string>('');

  allDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  isValid(): boolean {
    return Object.values(this.selectedDays).some(v => v === true);
  }

  addSchedule(): void {
    if (!this.isValid()) return;

    const schedule = {
      entryType: this.entryType(),
      daysOfWeek: Object.entries(this.selectedDays)
        .filter(([_, selected]) => selected)
        .map(([day]) => day as DayOfWeek),
      time: this.time() || undefined,
      notes: this.notes() || undefined,
      enabled: true,
    };

    this.dialogRef.close(schedule);
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
