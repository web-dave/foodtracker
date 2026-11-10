import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SportEntry } from '../../models/entries';

@Component({
  selector: 'app-sport-input',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-card class="sport-card">
      <mat-card-header>
        <mat-card-title>🏃 Sport erfassen</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="input-group">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Aktivität</mat-label>
            <input
              matInput
              [(ngModel)]="activity"
              type="text"
              placeholder="z.B. Joggen, Radfahren"
            />
          </mat-form-field>

          <div class="row">
            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Dauer (Minuten)</mat-label>
              <input
                matInput
                [(ngModel)]="duration"
                type="number"
                min="1"
                placeholder="0"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="flex-1">
              <mat-label>Intensität</mat-label>
              <mat-select [(ngModel)]="intensity">
                <mat-option value="low">Leicht</mat-option>
                <mat-option value="moderate">Moderat</mat-option>
                <mat-option value="high">Intensiv</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Verbrannte Kalorien (optional)</mat-label>
            <input
              matInput
              [(ngModel)]="caloriesBurned"
              type="number"
              placeholder="0"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notizen (optional)</mat-label>
            <input
              matInput
              [(ngModel)]="notes"
              type="text"
              placeholder="z.B. Mit Freunden"
            />
          </mat-form-field>

          <button
            mat-raised-button
            color="accent"
            (click)="submit()"
            [disabled]="!activity.trim() || !duration || duration <= 0"
            class="full-width"
          >
            <mat-icon>add_circle</mat-icon>
            Hinzufügen
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .sport-card {
      margin-bottom: 20px;
    }

    mat-card-header {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      margin-bottom: 16px;

      mat-card-title {
        font-size: 18px;
        margin: 0;
      }
    }

    mat-card-content {
      padding: 16px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .full-width,
    .flex-1 {
      width: 100%;
    }

    mat-form-field {
      display: block;
    }

    button[mat-raised-button] {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 40px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:disabled {
        opacity: 0.6;
      }
    }

    @media (max-width: 600px) {
      mat-card-header {
        padding: 12px;
      }

      mat-card-content {
        padding: 12px;
      }
    }
  `,
})
export class SportInputComponent implements OnInit {
  entry = input<SportEntry | null>(null);
  sportAdded = output<Omit<SportEntry, 'id'>>();

  activity = '';
  duration = 0;
  intensity: 'low' | 'moderate' | 'high' = 'moderate';
  caloriesBurned = 0;
  notes = '';

  ngOnInit(): void {
    const initialEntry = this.entry();
    if (initialEntry) {
      this.activity = initialEntry.activity;
      this.duration = initialEntry.duration;
      this.intensity = initialEntry.intensity;
      this.caloriesBurned = initialEntry.caloriesBurned ?? 0;
      this.notes = initialEntry.notes ?? '';
    }
  }

  submit(): void {
    if (!this.activity.trim() || !this.duration || this.duration <= 0) return;

    const entry: Omit<SportEntry, 'id'> = {
      type: 'sport',
      timestamp: this.entry()?.timestamp ?? new Date(),
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
