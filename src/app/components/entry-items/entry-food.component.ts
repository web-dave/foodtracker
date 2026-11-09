import { Component, input, output } from '@angular/core';
import { FoodEntry } from '../../models/entries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-food',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="food-entry">
      <div class="food-header">
        <span class="icon">🍽️</span>
        <div class="header-content">
          <span class="description">{{ entry().description }}</span>
          <span class="meal-type-badge" [class]="'meal-' + entry().mealType">
            {{ mealTypeLabel(entry().mealType) }}
            @if (entry().mealNumber && entry().totalMeals) {
              ({{ entry().mealNumber }}/{{ entry().totalMeals }})
            } @else if (entry().mealNumber) {
              ({{ entry().mealNumber }})
            }
          </span>
        </div>
      </div>
      @if (entry().imageUrl) {
        <div class="food-image">
          <img [src]="entry().imageUrl" alt="Food photo" />
        </div>
      }
      @if (entry().nutrition) {
        <div class="nutrition-info">
          <div class="nutrition-row">
            <span>Kalorien:</span>
            <strong>{{ entry().nutrition!.calories }} kcal</strong>
          </div>
          <div class="nutrition-row">
            <span>Protein:</span>
            <strong>{{ entry().nutrition!.protein }}g</strong>
          </div>
          <div class="nutrition-row">
            <span>Kohlenhydrate:</span>
            <strong>{{ entry().nutrition!.carbs }}g</strong>
          </div>
          <div class="nutrition-row">
            <span>Fett:</span>
            <strong>{{ entry().nutrition!.fat }}g</strong>
          </div>
        </div>
      }
      @if (entry().confidence) {
        <div class="confidence">
          Zuverlässigkeit: {{ (entry().confidence! * 100 | number: '1.0-0') }}%
        </div>
      }
    </div>
  `,
  styles: `
    .food-entry {
      margin: 8px 0;
    }

    .food-header {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;

      .icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .header-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .description {
        font-size: 16px;
        font-weight: 500;
      }

      .meal-type-badge {
        font-size: 12px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 3px;
        display: inline-block;
        width: fit-content;

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
    }

    .food-image {
      margin: 12px 0;
      border-radius: 4px;
      overflow: hidden;
      max-height: 300px;

      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }

    .nutrition-info {
      margin: 12px 0;
      padding: 12px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #4CAF50;
    }

    .nutrition-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;

      strong {
        color: #4CAF50;
      }
    }

    .confidence {
      margin-top: 8px;
      font-size: 12px;
      color: #999;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }
  `,
})
export class EntryFoodComponent {
  entry = input.required<FoodEntry>();
  delete = output<void>();

  mealTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      breakfast: '🥣 Frühstück',
      lunch: '🍽️ Mittagessen',
      dinner: '🍴 Abendessen',
      snack: '🍎 Snack',
    };
    return labels[type] || type;
  }
}
