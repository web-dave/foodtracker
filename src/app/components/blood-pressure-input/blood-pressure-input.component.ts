import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BloodPressureEntry } from '../../models/entries';

@Component({
  selector: 'app-blood-pressure-input',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-card class="blood-pressure-card">
      <mat-card-header>
        <mat-card-title>💉 Blutdruck erfassen</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="input-group">
          <div class="bp-row">
            <mat-form-field appearance="outline" class="bp-field">
              <mat-label>Systolisch (oben)</mat-label>
              <input
                matInput
                [(ngModel)]="systolic"
                type="number"
                min="50"
                max="250"
                placeholder="120"
              />
              <mat-hint>mmHg</mat-hint>
            </mat-form-field>

            <span class="separator">/</span>

            <mat-form-field appearance="outline" class="bp-field">
              <mat-label>Diastolisch (unten)</mat-label>
              <input
                matInput
                [(ngModel)]="diastolic"
                type="number"
                min="30"
                max="160"
                placeholder="80"
              />
              <mat-hint>mmHg</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Herzfrequenz (optional)</mat-label>
            <input
              matInput
              [(ngModel)]="heartRate"
              type="number"
              min="30"
              max="220"
              placeholder="72"
            />
            <mat-hint>bpm</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notizen (optional)</mat-label>
            <input
              matInput
              [(ngModel)]="notes"
              type="text"
              placeholder="z.B. Nach dem Sport, Morgens..."
            />
          </mat-form-field>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button
          mat-raised-button
          color="primary"
          (click)="addBloodPressure()"
          [disabled]="!isValid()"
          class="action-btn"
        >
          <mat-icon>check_circle</mat-icon>
          Speichern
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .blood-pressure-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 500;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .bp-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bp-field {
      flex: 1;
    }

    .separator {
      font-size: 24px;
      font-weight: bold;
      color: #666;
      align-self: center;
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    mat-card-actions {
      padding: 0 16px 16px;
      display: flex;
      justify-content: flex-end;
    }

    .action-btn {
      gap: 8px;
    }

    mat-icon {
      margin-right: 4px;
    }
  `,
})
export class BloodPressureInputComponent implements OnInit {
  entry = input<BloodPressureEntry | null>(null);
  bloodPressureAdded = output<Omit<BloodPressureEntry, 'id'>>();

  systolic = signal<number | null>(null);
  diastolic = signal<number | null>(null);
  heartRate = signal<number | null>(null);
  notes = signal<string>('');

  ngOnInit(): void {
    const initialEntry = this.entry();
    if (initialEntry) {
      this.systolic.set(initialEntry.systolic);
      this.diastolic.set(initialEntry.diastolic);
      this.heartRate.set(initialEntry.heartRate ?? null);
      this.notes.set(initialEntry.notes ?? '');
    }
  }

  isValid(): boolean {
    return this.systolic() !== null && this.diastolic() !== null;
  }

  addBloodPressure(): void {
    if (!this.isValid()) return;

    const entry: Omit<BloodPressureEntry, 'id'> = {
      type: 'blood-pressure',
      timestamp: this.entry()?.timestamp ?? new Date(),
      systolic: this.systolic()!,
      diastolic: this.diastolic()!,
    };

    if (this.heartRate() !== null) {
      entry.heartRate = this.heartRate()!;
    }

    if (this.notes()) {
      entry.notes = this.notes();
    }

    this.bloodPressureAdded.emit(entry);

    this.systolic.set(null);
    this.diastolic.set(null);
    this.heartRate.set(null);
    this.notes.set('');
  }
}
