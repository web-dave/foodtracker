import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BloodPressureEntry } from '../../models/entries';

@Component({
  selector: 'app-entry-blood-pressure',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <div class="blood-pressure-entry">
      <div class="bp-display">
        <div class="bp-values">
          <span class="systolic">{{ entry().systolic }}</span>
          <span class="separator">/</span>
          <span class="diastolic">{{ entry().diastolic }}</span>
          <span class="unit">mmHg</span>
        </div>

        @if (entry().heartRate !== undefined) {
          <div class="heart-rate">
            <mat-icon class="heart-icon">favorite</mat-icon>
            {{ entry().heartRate }} bpm
          </div>
        }
      </div>

      @if (entry().notes) {
        <div class="notes">
          📝 {{ entry().notes }}
        </div>
      }

      <div class="bp-status">
        <mat-chip-set aria-label="Blood Pressure Status">
          <mat-chip [highlighted]="getBPStatus() === 'normal'">
            {{ getBPStatus() | uppercase }}
          </mat-chip>
        </mat-chip-set>
      </div>
    </div>
  `,
  styles: `
    .blood-pressure-entry {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bp-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .bp-values {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 20px;
      font-weight: 500;
    }

    .systolic {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
    }

    .diastolic {
      font-size: 24px;
      font-weight: 600;
      color: #34495e;
    }

    .separator {
      font-size: 18px;
      color: #7f8c8d;
    }

    .unit {
      font-size: 12px;
      color: #7f8c8d;
      font-weight: normal;
    }

    .heart-rate {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #e74c3c;
      font-weight: 500;
    }

    .heart-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .notes {
      font-size: 13px;
      color: #555;
      padding: 8px 12px;
      background: #f9f9f9;
      border-left: 3px solid #3498db;
      border-radius: 4px;
    }

    .bp-status {
      margin-top: 4px;
    }

    mat-chip {
      height: 28px;
      font-size: 12px;
    }
  `,
})
export class EntryBloodPressureComponent {
  entry = input.required<BloodPressureEntry>();

  getBPStatus(): string {
    const sys = this.entry().systolic;
    const dia = this.entry().diastolic;

    if (sys < 120 && dia < 80) return 'normal';
    if (sys < 130 && dia < 80) return 'elevated';
    if (sys < 140 && dia < 90) return 'stage1';
    if (sys >= 140 && dia >= 90) return 'stage2';
    if (sys > 180 && dia > 120) return 'crisis';

    return 'normal';
  }
}
