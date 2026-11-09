import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Entry } from '../../models/entries';

interface DayDetailsData {
  date: Date;
  entries: Entry[];
}

@Component({
  selector: 'app-day-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      📅 {{ formatDate(data.date) }}
    </h2>

    <mat-dialog-content class="dialog-content">
      @if (data.entries.length === 0) {
        <div class="empty-state">
          <mat-icon>event_busy</mat-icon>
          <p>Keine Einträge für diesen Tag</p>
        </div>
      } @else {
        <!-- Food Entries -->
        @if (foodEntries().length > 0) {
          <mat-card class="entries-card">
            <mat-card-header>
              <mat-card-title class="section-title">
                🍽️ Lebensmittel ({{ foodEntries().length }})
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="entries-list">
                @for (entry of foodEntries(); track entry.id) {
                  <div class="entry-item">
                    @if (entry.type === 'food') {
                      <div class="entry-header">
                        <div class="entry-info">
                          <span class="entry-time">
                            {{ formatTime(entry.timestamp) }}
                          </span>
                          @if (entry.description) {
                            <span class="entry-description">
                              {{ entry.description }}
                            </span>
                          }
                          @if (entry.mealType) {
                            <span class="meal-type-badge" [class]="'meal-' + entry.mealType">
                              {{ getMealTypeLabel(entry.mealType) }}
                              @if (entry.mealNumber && entry.totalMeals) {
                                ({{ entry.mealNumber }}/{{ entry.totalMeals }})
                              } @else if (entry.mealNumber) {
                                ({{ entry.mealNumber }})
                              }
                            </span>
                          }
                        </div>
                      </div>
                      @if (entry.nutrition) {
                        <div class="nutrition-mini">
                          <span class="nutrition-badge">
                            {{ entry.nutrition.calories }} kcal
                          </span>
                          <span class="nutrition-badge">
                            {{ entry.nutrition.protein }}g P
                          </span>
                          <span class="nutrition-badge">
                            {{ entry.nutrition.carbs }}g K
                          </span>
                          <span class="nutrition-badge">
                            {{ entry.nutrition.fat }}g F
                          </span>
                        </div>
                      }
                    }
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Weight Entries -->
        @if (weightEntries().length > 0) {
          <mat-card class="entries-card">
            <mat-card-header>
              <mat-card-title class="section-title">
                ⚖️ Gewicht ({{ weightEntries().length }})
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="entries-list">
                @for (entry of weightEntries(); track entry.id) {
                  <div class="entry-item">
                    @if (entry.type === 'weight') {
                      <div class="entry-header">
                        <div class="entry-info">
                          <span class="entry-time">
                            {{ formatTime(entry.timestamp) }}
                          </span>
                          <span class="entry-value">
                            {{ entry.weight }} {{ entry.unit }}
                          </span>
                        </div>
                        @if (entry.notes) {
                          <span class="entry-notes">{{ entry.notes }}</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Sport Entries -->
        @if (sportEntries().length > 0) {
          <mat-card class="entries-card">
            <mat-card-header>
              <mat-card-title class="section-title">
                🏃 Sport ({{ sportEntries().length }})
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="entries-list">
                @for (entry of sportEntries(); track entry.id) {
                  <div class="entry-item">
                    @if (entry.type === 'sport') {
                      <div class="entry-header">
                        <div class="entry-info">
                          <span class="entry-time">
                            {{ formatTime(entry.timestamp) }}
                          </span>
                          <span class="entry-activity">
                            {{ entry.activity }}
                          </span>
                        </div>
                      </div>
                      <div class="sport-details">
                        <span class="sport-badge">
                          <mat-icon>schedule</mat-icon>
                          {{ entry.duration }} min
                        </span>
                        <span class="sport-badge">
                          <mat-icon>trending_up</mat-icon>
                          {{ getIntensityLabel(entry.intensity) }}
                        </span>
                        @if (entry.caloriesBurned) {
                          <span class="sport-badge">
                            <mat-icon>local_fire_department</mat-icon>
                            {{ entry.caloriesBurned }} kcal
                          </span>
                        }
                      </div>
                      @if (entry.notes) {
                        <span class="entry-notes">{{ entry.notes }}</span>
                      }
                    }
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Blood Pressure Entries -->
        @if (bloodPressureEntries().length > 0) {
          <mat-card class="entries-card">
            <mat-card-header>
              <mat-card-title class="section-title">
                💉 Blutdruck ({{ bloodPressureEntries().length }})
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="entries-list">
                @for (entry of bloodPressureEntries(); track entry.id) {
                  <div class="entry-item">
                    @if (entry.type === 'blood-pressure') {
                      <div class="entry-header">
                        <div class="entry-info">
                          <span class="entry-time">
                            {{ formatTime(entry.timestamp) }}
                          </span>
                          <span class="bp-values">
                            {{ entry.systolic }}/{{ entry.diastolic }} mmHg
                          </span>
                        </div>
                      </div>
                      <div class="bp-details">
                        @if (entry.heartRate) {
                          <span class="bp-badge">
                            <mat-icon>favorite</mat-icon>
                            {{ entry.heartRate }} bpm
                          </span>
                        }
                        @if (entry.notes) {
                          <span class="bp-badge">📝 {{ entry.notes }}</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Schließen</button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-title {
      font-size: 22px;
      font-weight: 500;
      margin: 0 0 16px 0;
      padding: 0;
    }

    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      padding: 0;
      margin: 16px 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #999;
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        opacity: 0.6;
      }

      p {
        font-size: 16px;
        margin: 0;
      }
    }

    .entries-card {
      margin-bottom: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      mat-card-header {
        padding: 12px 16px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.08);
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        padding: 0;
      }

      mat-card-content {
        padding: 12px 0;
      }
    }

    .entries-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .entry-item {
      padding: 12px 16px;
      border-left: 4px solid #667eea;
      background: #f9f9f9;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: #f0f0f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
    }

    .entry-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .entry-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .entry-time {
      font-size: 12px;
      color: #999;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.05);
      padding: 4px 8px;
      border-radius: 4px;
    }

    .entry-description,
    .entry-activity {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .meal-type-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 6px;
      border-radius: 3px;
      margin-left: 8px;

      &.meal-breakfast {
        background: #fff3cd;
        color: #856404;
      }

      &.meal-lunch {
        background: #d1ecf1;
        color: #0c5460;
      }

      &.meal-dinner {
        background: #d4edda;
        color: #155724;
      }

      &.meal-snack {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .entry-value {
      font-size: 16px;
      font-weight: 700;
      color: #667eea;
    }

    .entry-notes {
      font-size: 12px;
      color: #666;
      font-style: italic;
      margin-top: 4px;
      display: block;
    }

    .nutrition-mini {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .nutrition-badge {
      display: inline-block;
      font-size: 11px;
      padding: 3px 6px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 3px;
      font-weight: 500;
    }

    .sport-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .sport-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      padding: 4px 8px;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border-radius: 4px;
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .bp-values {
      font-size: 14px;
      font-weight: 600;
      color: #c0392b;
    }

    .bp-details {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .bp-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      padding: 4px 8px;
      background: rgba(192, 57, 43, 0.1);
      color: #c0392b;
      border-radius: 4px;
      font-weight: 500;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
      margin-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 600px) {
      .dialog-content {
        max-height: 60vh;
      }

      .entries-card {
        margin-bottom: 12px;
      }

      .nutrition-mini,
      .sport-details {
        gap: 4px;
      }

      .nutrition-badge,
      .sport-badge {
        font-size: 10px;
        padding: 2px 4px;
      }
    }
  `,
})
export class DayDetailsDialogComponent {
  data = inject(MAT_DIALOG_DATA) as DayDetailsData;

  foodEntries() {
    return this.data.entries.filter(e => e.type === 'food');
  }

  weightEntries() {
    return this.data.entries.filter(e => e.type === 'weight');
  }

  sportEntries() {
    return this.data.entries.filter(e => e.type === 'sport');
  }

  bloodPressureEntries() {
    return this.data.entries.filter(e => e.type === 'blood-pressure');
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  formatTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  getMealTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      breakfast: '🥣 Frühstück',
      lunch: '🍽️ Mittagessen',
      dinner: '🍴 Abendessen',
      snack: '🍎 Snack',
    };
    return labels[type] || type;
  }

  getIntensityLabel(intensity: string): string {
    const labels: Record<string, string> = {
      low: 'Niedrig',
      moderate: 'Mittel',
      high: 'Hoch',
    };
    return labels[intensity] || intensity;
  }
}
