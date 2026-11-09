import { Component, input, output } from '@angular/core';
import { SportEntry } from '../../models/entries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-sport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sport-entry">
      <div class="sport-header">
        <span class="icon">🏃</span>
        <span class="activity">{{ entry().activity }}</span>
      </div>
      <div class="sport-details">
        <div class="detail">
          <span>Dauer:</span>
          <strong>{{ entry().duration }} Min</strong>
        </div>
        <div class="detail">
          <span>Intensität:</span>
          <strong>{{ entry().intensity }}</strong>
        </div>
        @if (entry().caloriesBurned) {
          <div class="detail">
            <span>Verbrannte Kalorien:</span>
            <strong>{{ entry().caloriesBurned }} kcal</strong>
          </div>
        }
      </div>
      @if (entry().notes) {
        <div class="notes">
          {{ entry().notes }}
        </div>
      }
    </div>
  `,
  styles: `
    .sport-entry {
      margin: 8px 0;
    }

    .sport-header {
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

    .sport-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .detail {
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      strong {
        color: #FF9800;
      }
    }

    .notes {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
      font-style: italic;
    }
  `,
})
export class EntrySportComponent {
  entry = input.required<SportEntry>();
  delete = output<void>();
}
