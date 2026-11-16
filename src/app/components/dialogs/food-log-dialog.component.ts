import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FoodEntry } from '../../models/entries';

interface FoodLogDialogData {
  entries: FoodEntry[];
  periodLabel: string;
}

@Component({
  selector: 'app-food-log-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule],
  template: `
    <h2 mat-dialog-title>🍽️ Lebensmittelprotokoll – {{ data.periodLabel }}</h2>

    <mat-dialog-content class="dialog-content">
      @if (data.entries.length === 0) {
        <p>Keine Lebensmitteleinträge für diesen Zeitraum.</p>
      } @else {
        <div class="entries-list">
          @for (entry of sortedEntries(); track entry.id) {
            <mat-card class="entry-card">
              <mat-card-content>
                <div class="entry-header">
                  <strong>{{ formatDate(entry.timestamp) }}</strong>
                  <span>{{ getMealTypeLabel(entry.mealType) }}</span>
                </div>
                <p class="entry-description">{{ entry.description || 'Ohne Beschreibung' }}</p>
                @if (entry.nutrition) {
                  <p class="nutrition-line">
                    {{ entry.nutrition.calories }} kcal · {{ entry.nutrition.protein }}g Protein ·
                    {{ entry.nutrition.carbs }}g Kohlenhydrate · {{ entry.nutrition.fat }}g Fett
                  </p>
                }
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Schließen</button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      min-width: min(620px, 100%);
    }

    .entries-list {
      display: grid;
      gap: 12px;
      padding-bottom: 8px;
    }

    .entry-card {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      font-size: 0.9rem;
      color: #4a5568;
    }

    .entry-description {
      margin: 0 0 8px;
      font-size: 1rem;
      color: #1a202c;
    }

    .nutrition-line {
      margin: 0;
      font-size: 0.85rem;
      color: #2d3748;
    }

    @media (max-width: 640px) {
      .dialog-content {
        min-width: 0;
      }

      .entry-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class FoodLogDialogComponent {
  data = inject(MAT_DIALOG_DATA) as FoodLogDialogData;

  sortedEntries(): FoodEntry[] {
    return [...this.data.entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getMealTypeLabel(type: FoodEntry['mealType']): string {
    const labels: Record<FoodEntry['mealType'], string> = {
      breakfast: 'Frühstück',
      lunch: 'Mittagessen',
      dinner: 'Abendessen',
      snack: 'Snack',
    };
    return labels[type];
  }
}
