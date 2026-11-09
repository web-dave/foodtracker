import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../services/storage.service';
import { Entry, FoodEntry, WeightEntry, SportEntry } from '../models/entries';
import { FoodCaptureComponent } from './food-capture/food-capture.component';
import { WeightInputComponent } from './weight-input/weight-input.component';
import { SportInputComponent } from './sport-input/sport-input.component';
import { EntryFoodComponent } from './entry-items/entry-food.component';
import { EntryWeightComponent } from './entry-items/entry-weight.component';
import { EntrySportComponent } from './entry-items/entry-sport.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FoodCaptureComponent,
    WeightInputComponent,
    SportInputComponent,
    EntryFoodComponent,
    EntryWeightComponent,
    EntrySportComponent,
  ],
  template: `
    <div class="timeline-container">
      <div class="timeline-header">
        <h1>📅 {{ todayFormatted }}</h1>
      </div>

      <div class="input-section">
        <app-food-capture (foodEntryCreated)="onFoodCaptured($event)" />
        <app-weight-input (weightAdded)="onWeightAdded($event)" />
        <app-sport-input (sportAdded)="onSportAdded($event)" />
      </div>

      <div class="timeline-entries">
        @if (todayEntries().length === 0) {
          <mat-card class="empty-state-card">
            <p>📭 Noch keine Einträge für heute</p>
          </mat-card>
        }

        @for (entry of todayEntries(); track entry.id) {
          <mat-card class="timeline-entry">
            <mat-card-content>
              <div class="entry-time">⏰ {{ getFormattedTime(entry.timestamp) }}</div>

              @if (entry.type === 'food') {
                <app-entry-food [entry]="castToFoodEntry(entry)" />
              }
              @if (entry.type === 'weight') {
                <app-entry-weight [entry]="castToWeightEntry(entry)" />
              }
              @if (entry.type === 'sport') {
                <app-entry-sport [entry]="castToSportEntry(entry)" />
              }
            </mat-card-content>
            <mat-card-actions>
              <button
                mat-icon-button
                (click)="deleteEntry(entry.id)"
                color="warn"
                class="delete-btn"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: `
    .timeline-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 12px;
      min-height: 100%;

      @media (min-width: 768px) {
        padding: 24px;
      }
    }

    .timeline-header {
      margin-bottom: 32px;
      text-align: center;

      h1 {
        font-size: 32px;
        color: #333;
        margin: 0;
        font-weight: 300;
      }
    }

    .input-section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
      padding: 12px 0;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);

      @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
        padding-bottom: 24px;
      }
    }

    .timeline-entries {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .empty-state-card {
      text-align: center;
      padding: 48px 24px;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-left: 4px solid #bdbdbd;

      p {
        font-size: 18px;
        color: #999;
        margin: 0;
      }
    }

    .timeline-entry {
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
      }

      mat-card-content {
        padding: 16px;
      }

      mat-card-actions {
        padding: 8px 16px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .entry-time {
      font-size: 12px;
      color: #999;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .delete-btn {
      &:hover {
        background-color: rgba(244, 67, 54, 0.1);
      }
    }

    @media (max-width: 600px) {
      .timeline-container {
        padding: 16px;
      }

      .timeline-header h1 {
        font-size: 24px;
      }

      .input-section {
        grid-template-columns: 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }
    }
  `,
})
export class TimelineComponent implements OnInit {
  private storageService = inject(StorageService);

  todayEntries = computed(() => {
    const today = new Date();
    return this.storageService.getEntriesByDate(today).sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
  });

  todayFormatted = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  ngOnInit(): void {}

  onFoodCaptured(entry: FoodEntry): void {
    this.storageService.addEntry(entry);
  }

  onWeightAdded(entry: Omit<WeightEntry, 'id'>): void {
    this.storageService.addEntry(entry);
  }

  onSportAdded(entry: Omit<SportEntry, 'id'>): void {
    this.storageService.addEntry(entry);
  }

  deleteEntry(id: string): void {
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      this.storageService.deleteEntry(id);
    }
  }

  getFormattedTime(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  castToFoodEntry(entry: Entry): FoodEntry {
    return entry as FoodEntry;
  }

  castToWeightEntry(entry: Entry): WeightEntry {
    return entry as WeightEntry;
  }

  castToSportEntry(entry: Entry): SportEntry {
    return entry as SportEntry;
  }
}
