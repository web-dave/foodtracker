import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeightEntry } from '../../models/entries';

@Component({
  selector: 'app-weight-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="weight-input">
      <h2>⚖️ Gewicht</h2>

      <div class="input-group">
        <div class="input-row">
          <label>Gewicht:</label>
          <div class="input-with-unit">
            <input
              [(ngModel)]="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              class="input-field"
            />
            <select [(ngModel)]="unit" class="unit-select">
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <div class="input-row">
          <label>Notizen (optional):</label>
          <input
            [(ngModel)]="notes"
            type="text"
            placeholder="z.B. Morgens gemessen"
            class="input-field"
          />
        </div>

        <button
          (click)="submit()"
          [disabled]="!weight || weight <= 0"
          class="btn btn-primary"
        >
          ✅ Hinzufügen
        </button>
      </div>
    </div>
  `,
  styles: `
    .weight-input {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      background: #fafafa;

      h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: #333;
      }
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .input-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }

    .input-with-unit {
      display: flex;
      gap: 8px;

      .input-field {
        flex: 1;
      }

      .unit-select {
        width: 80px;
      }
    }

    .input-field,
    .unit-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #2196F3;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
      }
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
      background: #2196F3;
      color: white;

      &:hover:not(:disabled) {
        background: #1976D2;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  `,
})
export class WeightInputComponent {
  weightAdded = output<Omit<WeightEntry, 'id'>>();

  weight = 0;
  unit: 'kg' | 'lbs' = 'kg';
  notes = '';

  submit(): void {
    if (!this.weight || this.weight <= 0) return;

    const entry: Omit<WeightEntry, 'id'> = {
      type: 'weight',
      timestamp: new Date(),
      weight: this.weight,
      unit: this.unit,
      notes: this.notes || undefined,
    };

    this.weightAdded.emit(entry);
    this.reset();
  }

  private reset(): void {
    this.weight = 0;
    this.notes = '';
  }
}
