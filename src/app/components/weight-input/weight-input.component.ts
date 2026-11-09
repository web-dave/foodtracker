import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeightEntry } from '../../models/entries';

@Component({
  selector: 'app-weight-input',
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
    <mat-card class="weight-card">
      <mat-card-header>
        <mat-card-title>⚖️ Gewicht erfassen</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="input-group">
          <div class="weight-row">
            <mat-form-field appearance="outline" class="weight-field">
              <mat-label>Gewicht</mat-label>
              <input
                matInput
                [(ngModel)]="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="unit-field">
              <mat-label>Einheit</mat-label>
              <mat-select [(ngModel)]="unit">
                <mat-option value="kg">kg</mat-option>
                <mat-option value="lbs">lbs</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notizen (optional)</mat-label>
            <input
              matInput
              [(ngModel)]="notes"
              type="text"
              placeholder="z.B. Morgens gemessen"
            />
          </mat-form-field>

          <button
            mat-raised-button
            color="accent"
            (click)="submit()"
            [disabled]="!weight || weight <= 0"
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
    .weight-card {
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

    .weight-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .weight-field,
    .unit-field,
    .full-width {
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
export class WeightInputComponent implements OnInit {
  entry = input<WeightEntry | null>(null);
  weightAdded = output<Omit<WeightEntry, 'id'>>();

  weight = 0;
  unit: 'kg' | 'lbs' = 'kg';
  notes = '';

  ngOnInit(): void {
    const initialEntry = this.entry();
    if (initialEntry) {
      this.weight = initialEntry.weight;
      this.unit = initialEntry.unit;
      this.notes = initialEntry.notes ?? '';
    }
  }

  submit(): void {
    if (!this.weight || this.weight <= 0) return;

    const entry: Omit<WeightEntry, 'id'> = {
      type: 'weight',
      timestamp: this.entry()?.timestamp ?? new Date(),
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
