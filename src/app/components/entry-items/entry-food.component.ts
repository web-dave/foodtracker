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
        <span class="description">{{ entry().description }}</span>
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
}
