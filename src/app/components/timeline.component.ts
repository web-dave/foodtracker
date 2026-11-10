import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { Entry, FoodEntry, WeightEntry, SportEntry, BloodPressureEntry } from '../models/entries';
import { EntryFoodComponent } from './entry-items/entry-food.component';
import { EntryWeightComponent } from './entry-items/entry-weight.component';
import { EntrySportComponent } from './entry-items/entry-sport.component';
import { EntryBloodPressureComponent } from './entry-items/entry-blood-pressure.component';
import { ScheduledTasksComponent } from './scheduled-tasks/scheduled-tasks.component';
import { FoodDialogComponent } from './dialogs/food-dialog.component';
import { WeightDialogComponent } from './dialogs/weight-dialog.component';
import { SportDialogComponent } from './dialogs/sport-dialog.component';
import { BloodPressureDialogComponent } from './dialogs/blood-pressure-dialog.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    EntryFoodComponent,
    EntryWeightComponent,
    EntrySportComponent,
    EntryBloodPressureComponent,
    ScheduledTasksComponent,
  ],
  template: `
    <div class="timeline-container">
      <div class="timeline-header">
        <h1>📅 {{ todayFormatted }}</h1>
      </div>

      <app-scheduled-tasks />

      <div class="input-section">
        <button
          mat-raised-button
          color="primary"
          (click)="openFoodDialog()"
          class="action-button"
        >
          <mat-icon>restaurant</mat-icon>
          <span>Essen</span>
        </button>
        <button
          mat-raised-button
          color="accent"
          (click)="openWeightDialog()"
          class="action-button"
        >
          <mat-icon>scale</mat-icon>
          <span>Gewicht</span>
        </button>
        <button
          mat-raised-button
          color="warn"
          (click)="openSportDialog()"
          class="action-button"
        >
          <mat-icon>directions_run</mat-icon>
          <span>Sport</span>
        </button>
      </div>

      <div class="input-section-secondary">
        <button
          mat-raised-button
          color="primary"
          (click)="openBloodPressureDialog()"
          class="action-button"
        >
          <mat-icon>favorite</mat-icon>
          <span>Blutdruck</span>
        </button>
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
              @if (entry.type === 'blood-pressure') {
                <app-entry-blood-pressure [entry]="castToBloodPressureEntry(entry)" />
              }
            </mat-card-content>
            <mat-card-actions>
              <button
                mat-icon-button
                (click)="editEntry(entry)"
                color="primary"
                aria-label="Eintrag bearbeiten"
                class="edit-btn"
              >
                <mat-icon>edit</mat-icon>
              </button>
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
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px 0;
      border-bottom: 2px solid rgba(0, 0, 0, 0.08);

      @media (min-width: 500px) {
        gap: 16px;
      }

      @media (min-width: 768px) {
        gap: 20px;
        margin-bottom: 24px;
        padding-bottom: 24px;
      }
    }

    .input-section-secondary {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      margin-bottom: 24px;

      @media (min-width: 500px) {
        gap: 16px;
      }

      @media (min-width: 768px) {
        gap: 20px;
        margin-bottom: 40px;
      }
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 8px;
      height: auto;
      font-size: 14px;
      font-weight: 500;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      span {
        white-space: nowrap;
      }

      @media (max-width: 500px) {
        padding: 12px 4px;
        font-size: 12px;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
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
        gap: 8px;
      }
    }

    .edit-btn {
      &:hover {
        background-color: rgba(63, 81, 181, 0.1);
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
    }
  `,
})
export class TimelineComponent implements OnInit {
  private storageService = inject(StorageService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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

  editEntry(entry: Entry): void {
    switch (entry.type) {
      case 'food':
        this.openFoodDialog(entry as FoodEntry);
        return;
      case 'weight':
        this.openWeightDialog(entry as WeightEntry);
        return;
      case 'sport':
        this.openSportDialog(entry as SportEntry);
        return;
      case 'blood-pressure':
        this.openBloodPressureDialog(entry as BloodPressureEntry);
        return;
      default:
        return;
    }
  }

  openFoodDialog(entry?: FoodEntry): void {
    this.dialog
      .open(FoodDialogComponent, {
        width: '100%',
        maxWidth: '500px',
        panelClass: 'food-dialog',
        data: entry ?? null,
      })
      .afterClosed()
      .subscribe((savedEntry: FoodEntry | undefined) => {
        if (!savedEntry) return;

        if (entry) {
          this.storageService.updateEntry(entry.id, {
            ...savedEntry,
            id: entry.id,
          } as Partial<Entry>);
          return;
        }

        this.storageService.addEntry(savedEntry);
      });
  }

  openWeightDialog(entry?: WeightEntry): void {
    this.dialog
      .open(WeightDialogComponent, {
        width: '100%',
        maxWidth: '500px',
        panelClass: 'weight-dialog',
        data: entry ?? null,
      })
      .afterClosed()
      .subscribe((savedEntry: Omit<WeightEntry, 'id'> | undefined) => {
        if (!savedEntry) return;

        if (entry) {
          this.storageService.updateEntry(entry.id, {
            ...savedEntry,
            id: entry.id,
          } as Partial<Entry>);
          return;
        }

        this.storageService.addEntry(savedEntry as Omit<Entry, 'id'>);
      });
  }

  openSportDialog(entry?: SportEntry): void {
    this.dialog
      .open(SportDialogComponent, {
        width: '100%',
        maxWidth: '500px',
        panelClass: 'sport-dialog',
        data: entry ?? null,
      })
      .afterClosed()
      .subscribe((savedEntry: Omit<SportEntry, 'id'> | undefined) => {
        if (!savedEntry) return;

        if (entry) {
          this.storageService.updateEntry(entry.id, {
            ...savedEntry,
            id: entry.id,
          } as Partial<Entry>);
          return;
        }

        this.storageService.addEntry(savedEntry as Omit<Entry, 'id'>);
      });
  }

  openBloodPressureDialog(entry?: BloodPressureEntry): void {
    this.dialog
      .open(BloodPressureDialogComponent, {
        width: '100%',
        maxWidth: '500px',
        panelClass: 'blood-pressure-dialog',
        data: entry ?? null,
      })
      .afterClosed()
      .subscribe((savedEntry: Omit<BloodPressureEntry, 'id'> | undefined) => {
        if (!savedEntry) return;

        if (entry) {
          this.storageService.updateEntry(entry.id, {
            ...savedEntry,
            id: entry.id,
          } as Partial<Entry>);
          return;
        }

        this.storageService.addEntry(savedEntry as Omit<Entry, 'id'>);
      });
  }

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
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eintrag löschen',
        message: 'Möchten Sie diesen Eintrag wirklich löschen?',
        confirmText: 'Löschen',
        cancelText: 'Abbrechen',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.storageService.deleteEntry(id);
        this.snackBar.open('Eintrag gelöscht', 'OK', {
          duration: 2500,
        });
      }
    });
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

  castToBloodPressureEntry(entry: Entry): BloodPressureEntry {
    return entry as BloodPressureEntry;
  }
}
