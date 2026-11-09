import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SportEntry } from '../../models/entries';

@Component({
  selector: 'app-sport-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="sport-input">
      <h2>🏃 Sport</h2>

      <div class="input-group">
        <div class="input-row">
          <label>Aktivität:</label>
          <input
            [(ngModel)]="activity"
            type="text"
            placeholder="z.B. Joggen, Radfahren"
            class="input-field"
          />
        </div>

        <div class="input-row">
          <label>Dauer (Minuten):</label>
          <input
            [(ngModel)]="duration"
            type="number"
            min="1"
            placeholder="0"
            class="input-field"
          />
        </div>

        <div class="input-row">
          <label>Intensität:</label>
          <select [(ngModel)]="intensity" class="input-field">
            <option value="low">Leicht</option>
            <option value="moderate">Moderat</option>
            <option value="high">Intensiv</option>
          </select>
        </div>

        <div class="input-row">
          <label>Verbrannte Kalorien (optional):</label>
          <input
            [(ngModel)]="caloriesBurned"
            type="number"
            placeholder="0"
            class="input-field"
          />
        </div>

        <div class="input-row">
          <label>Notizen (optional):</label>
          <input
            [(ngModel)]="notes"
            type="text"
            placeholder="z.B. Mit Freunden"
            class="input-field"
          />
        </div>

        <button
          (click)="submit()"
          [disabled]="!activity.trim() || !duration || duration <= 0"
          class="btn btn-primary"
        >
          ✅ Hinzufügen
        </button>
      </div>
    </div>
  `,
  styles: `
    .sport-input {
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

    .input-field {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: #FF9800;
        box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.1);
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
      background: #FF9800;
      color: white;

      &:hover:not(:disabled) {
        background: #E68900;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  `,
})
export class SportInputComponent {
  sportAdded = output<Omit<SportEntry, 'id'>>();

  activity = '';
  duration = 0;
  intensity: 'low' | 'moderate' | 'high' = 'moderate';
  caloriesBurned = 0;
  notes = '';

  submit(): void {
    if (!this.activity.trim() || !this.duration || this.duration <= 0) return;

    const entry: Omit<SportEntry, 'id'> = {
      type: 'sport',
      timestamp: new Date(),
      activity: this.activity,
      duration: this.duration,
      intensity: this.intensity,
      caloriesBurned: this.caloriesBurned || undefined,
      notes: this.notes || undefined,
    };

    this.sportAdded.emit(entry);
    this.reset();
  }

  private reset(): void {
    this.activity = '';
    this.duration = 0;
    this.intensity = 'moderate';
    this.caloriesBurned = 0;
    this.notes = '';
  }
}
