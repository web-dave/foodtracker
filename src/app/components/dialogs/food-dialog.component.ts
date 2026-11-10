import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FoodCaptureComponent } from '../food-capture/food-capture.component';
import { FoodEntry } from '../../models/entries';

@Component({
  selector: 'app-food-dialog',
  standalone: true,
  imports: [MatDialogModule, FoodCaptureComponent],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? '🍽️ Essen bearbeiten' : '🍽️ Essen erfassen' }}</h2>
    <mat-dialog-content>
      <app-food-capture
        [entry]="entry"
        (foodEntryCreated)="onFoodEntryCreated($event)"
      />
    </mat-dialog-content>
  `,
  styles: `
    mat-dialog-content {
      padding: 16px 0;
      min-width: 280px;
      max-width: 500px;
    }

    h2 {
      margin: 0 0 16px 0;
    }
  `,
})
export class FoodDialogComponent {
  private dialogRef = inject(MatDialogRef<FoodDialogComponent>);
  readonly entry = inject<FoodEntry | null>(MAT_DIALOG_DATA, { optional: true });

  get isEditMode(): boolean {
    return !!this.entry;
  }

  onFoodEntryCreated(entry: FoodEntry): void {
    this.dialogRef.close(entry);
  }
}
