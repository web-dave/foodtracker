import { Component, input, output } from '@angular/core';
import { WeightEntry } from '../../models/entries';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-weight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weight-entry">
      <div class="weight-header">
        <span class="icon">⚖️</span>
        <span class="weight">{{ entry().weight }} {{ entry().unit }}</span>
      </div>
      <div *ngIf="entry().notes" class="notes">
        {{ entry().notes }}
      </div>
    </div>
  `,
  styles: `
    .weight-entry {
      margin: 8px 0;
    }

    .weight-header {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;

      .icon {
        font-size: 24px;
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
export class EntryWeightComponent {
  entry = input.required<WeightEntry>();
  delete = output<void>();
}
