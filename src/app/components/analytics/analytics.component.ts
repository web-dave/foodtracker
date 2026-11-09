import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { NutritionAnalysisService } from '../../services/nutrition-analysis.service';
import { Entry } from '../../models/entries';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <h1>📊 Analytik & Fortschritt</h1>

      <!-- Period Selection -->
      <div class="period-selector">
        <button
          *ngFor="let period of periodOptions"
          (click)="setPeriod(period)"
          [class.active]="selectedPeriod() === period"
          class="period-btn"
        >
          {{ getPeriodLabel(period) }}
        </button>
      </div>

      <!-- Nutrition Summary -->
      <div class="section">
        <h2>🥗 Ernährung</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Kalorien</div>
            <div class="stat-value">{{ dailyNutrition().calories }}</div>
            <div class="stat-unit">kcal</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Protein</div>
            <div class="stat-value">{{ dailyNutrition().protein }}</div>
            <div class="stat-unit">g</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Kohlenhydrate</div>
            <div class="stat-value">{{ dailyNutrition().carbs }}</div>
            <div class="stat-unit">g</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Fett</div>
            <div class="stat-value">{{ dailyNutrition().fat }}</div>
            <div class="stat-unit">g</div>
          </div>
        </div>
      </div>

      <!-- Weight Tracking -->
      <div class="section">
        <h2>⚖️ Gewichtsverlauf</h2>
        <div *ngIf="weightCount() === 0" class="empty-state">
          <p>Keine Gewichtsmessungen für diesen Zeitraum</p>
        </div>
        <div *ngIf="weightCount() > 0" class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Aktuelle Messung</div>
            <div class="stat-value">{{ getLatestWeight() }}</div>
            <div class="stat-unit">kg</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Durchschnitt</div>
            <div class="stat-value">{{ getAverageWeight() }}</div>
            <div class="stat-unit">kg</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Unterschied</div>
            <div class="stat-value">{{ getWeightDifference() }}</div>
            <div class="stat-unit">kg</div>
          </div>
        </div>
      </div>

      <!-- Sport Tracking -->
      <div class="section">
        <h2>🏃 Sportaktivitäten</h2>
        <div *ngIf="sportCount() === 0" class="empty-state">
          <p>Keine Sportaktivitäten für diesen Zeitraum</p>
        </div>
        <div *ngIf="sportCount() > 0" class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Aktivitäten</div>
            <div class="stat-value">{{ sportCount() }}</div>
            <div class="stat-unit">Trainings</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Gesamtdauer</div>
            <div class="stat-value">{{ getTotalSportDuration() }}</div>
            <div class="stat-unit">Min</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Kalorien</div>
            <div class="stat-value">{{ getTotalCaloriesBurned() }}</div>
            <div class="stat-unit">kcal</div>
          </div>
        </div>
      </div>

      <!-- Food Log -->
      <div class="section">
        <h2>🍽️ Lebensmittelprotokoll</h2>
        <div *ngIf="foodCount() === 0" class="empty-state">
          <p>Keine Lebensmitteleinträge für diesen Zeitraum</p>
        </div>
        <div *ngIf="foodCount() > 0">
          <p>{{ foodCount() }} Lebensmitteleinträge in diesem Zeitraum</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .analytics-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;

      h1 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
      }
    }

    .period-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 30px;
      justify-content: center;

      .period-btn {
        padding: 8px 16px;
        border: 2px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
          border-color: #2196F3;
        }

        &.active {
          background: #2196F3;
          color: white;
          border-color: #2196F3;
        }
      }
    }

    .section {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;

      h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: #333;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 12px;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:nth-child(2) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &:nth-child(4) {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-unit {
        font-size: 12px;
        opacity: 0.8;
      }
    }

    .empty-state {
      text-align: center;
      padding: 30px 20px;
      color: #999;
      font-size: 14px;
    }

    @media (max-width: 600px) {
      .analytics-container {
        padding: 12px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
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

  foodEntries = computed(() =>
    this.periodEntries().filter(e => e.type === 'food')
  );

  weightEntries = computed(() =>
    this.periodEntries().filter(e => e.type === 'weight')
  );

  sportEntries = computed(() =>
    this.periodEntries().filter(e => e.type === 'sport')
  );

  foodCount = computed(() => this.foodEntries().length);
  weightCount = computed(() => this.weightEntries().length);
  sportCount = computed(() => this.sportEntries().length);

  dailyNutrition = computed(() => {
    const entries = this.foodEntries().map(e => ({
      nutrition: (e as any).nutrition,
    }));
    return this.nutritionService.calculateDailyTotals(entries);
  });

  getLatestWeight(): number {
    const entries = this.weightEntries() as any[];
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].weight;
  }

  getAverageWeight(): number {
    const entries = this.weightEntries() as any[];
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + e.weight, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  }

  getWeightDifference(): number {
    const entries = this.weightEntries() as any[];
    if (entries.length < 2) return 0;
    const latest = entries[entries.length - 1].weight;
    const oldest = entries[0].weight;
    return Math.round((latest - oldest) * 10) / 10;
  }

  getTotalSportDuration(): number {
    return (this.sportEntries() as any[]).reduce(
      (acc, e) => acc + e.duration,
      0
    );
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
}
