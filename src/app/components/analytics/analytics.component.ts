import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { StorageService } from '../../services/storage.service';
import { NutritionAnalysisService } from '../../services/nutrition-analysis.service';
import { Entry } from '../../models/entries';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
  ],
  template: `
    <div class="analytics-container">
      <mat-card class="analytics-header-card">
        <mat-card-title>📊 Analytik & Fortschritt</mat-card-title>

        <!-- Period Selection -->
        <mat-button-toggle-group
          [value]="selectedPeriod()"
          (change)="setPeriod($event.value)"
          appearance="standard"
          class="period-selector"
        >
          @for (period of periodOptions; track period) {
            <mat-button-toggle [value]="period">
              {{ getPeriodLabel(period) }}
            </mat-button-toggle>
          }
        </mat-button-toggle-group>
      </mat-card>

      <!-- Nutrition Summary -->
      <!-- <mat-card class="section-card">
        <mat-card-title>🥗 Ernährung</mat-card-title>
        <mat-card-content>
          <div class="stats-grid">
            <mat-card class="stat-card stat-card-1">
              <mat-card-content>
                <div class="stat-label">Kalorien</div>
                <div class="stat-value">{{ dailyNutrition().calories }}</div>
                <div class="stat-unit">kcal</div>
              </mat-card-content>
            </mat-card>
            <mat-card class="stat-card stat-card-2">
              <mat-card-content>
                <div class="stat-label">Protein</div>
                <div class="stat-value">{{ dailyNutrition().protein }}</div>
                <div class="stat-unit">g</div>
              </mat-card-content>
            </mat-card>
            <mat-card class="stat-card stat-card-3">
              <mat-card-content>
                <div class="stat-label">Kohlenhydrate</div>
                <div class="stat-value">{{ dailyNutrition().carbs }}</div>
                <div class="stat-unit">g</div>
              </mat-card-content>
            </mat-card>
            <mat-card class="stat-card stat-card-4">
              <mat-card-content>
                <div class="stat-label">Fett</div>
                <div class="stat-value">{{ dailyNutrition().fat }}</div>
                <div class="stat-unit">g</div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-card-content>
      </mat-card> -->

      <!-- Weight Tracking -->
      <mat-card class="section-card">
        <mat-card-title>⚖️ Gewichtsverlauf</mat-card-title>
        <mat-card-content>
          @if (weightCount() === 0) {
            <div class="empty-state">
              <mat-icon>scale</mat-icon>
              <p>Keine Gewichtsmessungen für diesen Zeitraum</p>
            </div>
          }
          @if (weightCount() > 0) {
            <div class="weight-chart-wrapper" aria-label="Gewichtsverlauf Diagramm">
              <svg
                class="weight-chart"
                viewBox="0 0 420 180"
                preserveAspectRatio="none"
                role="img"
                aria-label="Gewichtsverlauf"
              >
                <path class="weight-chart-line" [attr.d]="getWeightChartPath()"></path>
                @for (point of getWeightChartPoints(); track point.x; let i = $index) {
                  <circle
                    class="weight-chart-point"
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="4"
                  ></circle>
                }
                @for (label of getWeightChartDateLabels(); track label.x) {
                  <text
                    class="weight-chart-date-label"
                    [attr.x]="label.x"
                    [attr.y]="label.y"
                    text-anchor="middle"
                  >
                    {{ label.text }}
                  </text>
                }
                @for (label of getWeightChartValueLabels(); track label.x) {
                  <text
                    class="weight-chart-value-label"
                    [attr.x]="label.x"
                    [attr.y]="label.y"
                    text-anchor="middle"
                  >
                    {{ label.text }}
                  </text>
                }
              </svg>
            </div>
            <div class="weight-loss-summary">
              <span class="weight-loss-label">Gewichtsverlust</span>
              <span class="weight-loss-value">{{ getWeightLossText() }}</span>
            </div>
            <!-- <div class="stats-grid">
              <mat-card class="stat-card stat-card-1">
                <mat-card-content>
                  <div class="stat-label">Aktuelle Messung</div>
                  <div class="stat-value">{{ getLatestWeight() }}</div>
                  <div class="stat-unit">kg</div>
                </mat-card-content>
              </mat-card>
              <mat-card class="stat-card stat-card-2">
                <mat-card-content>
                  <div class="stat-label">Durchschnitt</div>
                  <div class="stat-value">{{ getAverageWeight() }}</div>
                  <div class="stat-unit">kg</div>
                </mat-card-content>
              </mat-card>
              <mat-card class="stat-card stat-card-3">
                <mat-card-content>
                  <div class="stat-label">Unterschied</div>
                  <div class="stat-value">{{ getWeightDifference() }}</div>
                  <div class="stat-unit">kg</div>
                </mat-card-content>
              </mat-card>
            </div> -->
          }
        </mat-card-content>
      </mat-card>

      <!-- Sport Tracking -->
      <!-- <mat-card class="section-card">
        <mat-card-title>🏃 Sportaktivitäten</mat-card-title>
        <mat-card-content>
          @if (sportCount() === 0) {
            <div class="empty-state">
              <mat-icon>directions_run</mat-icon>
              <p>Keine Sportaktivitäten für diesen Zeitraum</p>
            </div>
          }
          @if (sportCount() > 0) {
            <div class="stats-grid">
              <mat-card class="stat-card stat-card-1">
                <mat-card-content>
                  <div class="stat-label">Aktivitäten</div>
                  <div class="stat-value">{{ sportCount() }}</div>
                  <div class="stat-unit">Trainings</div>
                </mat-card-content>
              </mat-card>
              <mat-card class="stat-card stat-card-2">
                <mat-card-content>
                  <div class="stat-label">Gesamtdauer</div>
                  <div class="stat-value">{{ getTotalSportDuration() }}</div>
                  <div class="stat-unit">Min</div>
                </mat-card-content>
              </mat-card>
              <mat-card class="stat-card stat-card-3">
                <mat-card-content>
                  <div class="stat-label">Kalorien</div>
                  <div class="stat-value">{{ getTotalCaloriesBurned() }}</div>
                  <div class="stat-unit">kcal</div>
                </mat-card-content>
              </mat-card>
            </div>
          }
        </mat-card-content>
      </mat-card> -->

      <!-- Food Log -->
      <mat-card class="section-card">
        <mat-card-title>🍽️ Lebensmittelprotokoll</mat-card-title>
        <mat-card-content>
          @if (foodCount() === 0) {
            <div class="empty-state">
              <mat-icon>restaurant</mat-icon>
              <p>Keine Lebensmitteleinträge für diesen Zeitraum</p>
            </div>
          }
          @if (foodCount() > 0) {
            <div class="food-count-badge" (click)="showFoodLog()">
              <mat-icon>check_circle</mat-icon>
              <span>{{ foodCount() }} Lebensmitteleinträge in diesem Zeitraum</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .analytics-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 12px;

      @media (min-width: 768px) {
        padding: 24px;
      }

      min-height: 100%;
    }

    .analytics-header-card {
      margin-bottom: 32px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      mat-card-title {
        font-size: 28px;
        margin-bottom: 20px;
        color: #333;
      }

      .period-selector {
        display: flex;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        mat-button-toggle {
          &.mat-button-toggle-checked {
            background-color: rgba(102, 126, 234, 0.1);
            color: #667eea;
            font-weight: 600;
          }
        }
      }
    }

    .section-card {
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      mat-card-title {
        font-size: 20px;
        margin: 0 0 20px 0;
        padding-bottom: 12px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.08);
        color: #333;
      }

      mat-card-content {
        padding: 20px 0;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
    }

    .stat-card {
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: white;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }

      mat-card-content {
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 140px;
      }

      &.stat-card-1 {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.stat-card-2 {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.stat-card-3 {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.stat-card-4 {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      .stat-label {
        font-size: 13px;
        opacity: 0.85;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .stat-value {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 4px;
        letter-spacing: -0.5px;
      }

      .stat-unit {
        font-size: 12px;
        opacity: 0.75;
        font-weight: 500;
      }
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

    .weight-chart-wrapper {
      margin: 0 0 18px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
      padding: 12px;
    }

    .weight-chart {
      width: 100%;
      height: 180px;
      display: block;
    }

    .weight-chart-line {
      fill: none;
      stroke: #667eea;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .weight-chart-point {
      fill: #667eea;
      stroke: white;
      stroke-width: 2;
    }

    .weight-chart-date-label,
    .weight-chart-value-label {
      fill: #4a5568;
      font-size: 10px;
      font-weight: 500;
    }

    .weight-chart-value-label {
      fill: #2d3748;
      font-weight: 700;
    }

    .weight-loss-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px 18px;
      border-radius: 10px;
      background: rgba(76, 175, 80, 0.08);
      border: 1px solid rgba(76, 175, 80, 0.12);
      color: #1b5e20;
      font-weight: 600;
    }

    .weight-loss-label {
      opacity: 0.8;
    }

    .weight-loss-value {
      font-size: 1.05rem;
    }

    .food-count-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      border-radius: 8px;
      color: white;
      font-weight: 500;

      mat-icon {
        color: white;
      }
    }

    @media (max-width: 600px) {
      .analytics-container {
        padding: 12px;
      }

      .analytics-header-card {
        mat-card-title {
          font-size: 22px;
        }

        .period-selector {
          flex-wrap: wrap;
          gap: 8px;
        }
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .stat-card mat-card-content {
        min-height: 120px;
        padding: 16px;
      }

      .stat-card .stat-value {
        font-size: 24px;
      }

      .stat-card .stat-label {
        font-size: 12px;
      }
    }
  `,
})
export class AnalyticsComponent {
  private storageService = inject(StorageService);
  private nutritionService = inject(NutritionAnalysisService);

  selectedPeriod = signal<'day' | 'week' | 'month'>('day');
  periodOptions: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];

  periodEntries = computed(() => {
    const today = new Date();
    let startDate = new Date(today);

    switch (this.selectedPeriod()) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
    }

    return this.storageService.getEntriesInRange(startDate, today);
  });

  foodEntries = computed(() => this.periodEntries().filter((e) => e.type === 'food'));

  weightEntries = computed(() =>
    this.periodEntries()
      .filter((e) => e.type === 'weight')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  );

  sportEntries = computed(() => this.periodEntries().filter((e) => e.type === 'sport'));

  foodCount = computed(() => this.foodEntries().length);
  weightCount = computed(() => this.weightEntries().length);
  sportCount = computed(() => this.sportEntries().length);

  dailyNutrition = computed(() => {
    const entries = this.foodEntries().map((e) => ({
      nutrition: (e as any).nutrition,
    }));
    return this.nutritionService.calculateDailyTotals(entries);
  });

  getSortedWeightEntries(): any[] {
    return [...(this.weightEntries() as any[])].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  }

  getLatestWeight(): number {
    const entries = this.getSortedWeightEntries();
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].weight;
  }

  getAverageWeight(): number {
    const entries = this.getSortedWeightEntries();
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + e.weight, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  }

  getWeightDifference(): number {
    const entries = this.getSortedWeightEntries();
    if (entries.length < 2) return 0;
    const latest = entries[entries.length - 1].weight;
    const oldest = entries[0].weight;
    return Math.round((latest - oldest) * 10) / 10;
  }

  getWeightLossText(): string {
    const difference = this.getWeightDifference();
    if (difference === 0) return '0,0 kg';
    if (difference > 0) return `${difference.toFixed(1).replace('.', ',')} kg zugenommen`;
    return `${Math.abs(difference).toFixed(1).replace('.', ',')} kg verloren`;
  }

  getWeightChartPoints(): Array<{ x: number; y: number }> {
    const entries = this.getSortedWeightEntries();
    if (entries.length === 0) return [];

    const chartWidth = 420;
    const chartHeight = 180;
    const padding = 18;
    const minWeight = Math.min(...entries.map((e) => e.weight));
    const maxWeight = Math.max(...entries.map((e) => e.weight));
    const range = maxWeight - minWeight || 1;

    return entries.map((entry, index) => {
      const x =
        entries.length === 1
          ? chartWidth / 2
          : padding + (index / (entries.length - 1)) * (chartWidth - padding * 2);
      const normalized = (entry.weight - minWeight) / range;
      const y = chartHeight - padding - normalized * (chartHeight - padding * 2);
      return { x, y };
    });
  }

  getWeightChartDateLabels(): Array<{ x: number; y: number; text: string }> {
    const entries = this.getSortedWeightEntries();
    if (entries.length === 0) return [];

    const points = this.getWeightChartPoints();
    const chartHeight = 180;
    const bottomY = chartHeight - 4;

    return points.map((point, index) => {
      const date = new Date(entries[index].timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return { x: point.x, y: bottomY, text: `${day}.${month}` };
    });
  }

  getWeightChartValueLabels(): Array<{ x: number; y: number; text: string }> {
    const entries = this.getSortedWeightEntries();
    if (entries.length === 0) return [];

    const points = this.getWeightChartPoints();

    return points.map((point, index) => ({
      x: point.x,
      y: point.y - 8,
      text: `${entries[index].weight.toFixed(1).replace('.', ',')} kg`,
    }));
  }

  getWeightChartPath(): string {
    const points = this.getWeightChartPoints();
    if (points.length === 0) return '';
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
  }

  getTotalSportDuration(): number {
    return (this.sportEntries() as any[]).reduce((acc, e) => acc + e.duration, 0);
  }

  getTotalCaloriesBurned(): number {
    return (this.sportEntries() as any[]).reduce((acc, e) => {
      return acc + (e.caloriesBurned || 0);
    }, 0);
  }

  setPeriod(period: 'day' | 'week' | 'month'): void {
    this.selectedPeriod.set(period);
  }

  getPeriodLabel(period: 'day' | 'week' | 'month'): string {
    const labels: Record<string, string> = {
      day: 'Heute',
      week: 'Diese Woche',
      month: 'Diesen Monat',
    };
    return labels[period];
  }

  /**
   * hier wird ein popup aufgerufen in dem alle eintraege aus dem gewaehlten Zeitraum angezeigt werden
   */
  showFoodLog() {}
}
