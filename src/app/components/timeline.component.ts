import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    FoodCaptureComponent,
    WeightInputComponent,
    SportInputComponent,
    EntryFoodComponent,
    EntryWeightComponent,
    EntrySportComponent,
  ],
  template: `
    <div class="timeline-container">
      <h1>{{ todayFormatted }}</h1>

      <div class="input-section">
        <app-food-capture (foodCaptured)="onFoodCaptured($event)" />
        <app-weight-input (weightAdded)="onWeightAdded($event)" />
        <app-sport-input (sportAdded)="onSportAdded($event)" />
      </div>

      <div class="timeline-entries">
        <div *ngIf="todayEntries().length === 0" class="empty-state">
          <p>Noch keine Einträge für heute</p>
        </div>

        <div *ngFor="let entry of todayEntries()" class="timeline-entry">
          <div class="entry-time">{{ getFormattedTime(entry.timestamp) }}</div>

          <app-entry-food
            *ngIf="entry.type === 'food'"
            [entry]="castToFoodEntry(entry)"
          />
          <app-entry-weight
            *ngIf="entry.type === 'weight'"
            [entry]="castToWeightEntry(entry)"
          />
          <app-entry-sport
            *ngIf="entry.type === 'sport'"
            [entry]="castToSportEntry(entry)"
          />

          <button class="delete-btn" (click)="deleteEntry(entry.id)">×</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .timeline-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;

      h1 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
      }
    }

    .input-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .timeline-entries {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 16px;
    }

    .timeline-entry {
      border-left: 4px solid #4CAF50;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 4px;
      position: relative;
      transition: all 0.2s ease;

      &:hover {
        background: #f0f0f0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .entry-time {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #ff5252;
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        background: #ff1744;
        transform: scale(1.1);
      }
    }

    @media (max-width: 600px) {
      .input-section {
        grid-template-columns: 1fr;
      }

      .timeline-entry {
        padding-right: 40px;
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

  onFoodCaptured(entry: Omit<FoodEntry, 'id'>): void {
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
