import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { WeightInputComponent } from '../weight-input/weight-input.component';
import { WeightEntry } from '../../models/entries';

@Component({
  selector: 'app-weight-dialog',
  standalone: true,
  imports: [MatDialogModule, WeightInputComponent],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? '⚖️ Gewicht bearbeiten' : '⚖️ Gewicht erfassen' }}</h2>
    <mat-dialog-content>
      <app-weight-input [entry]="entry" (weightAdded)="onWeightAdded($event)" />
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
export class WeightDialogComponent {
  private dialogRef = inject(MatDialogRef<WeightDialogComponent>);
  readonly entry = inject<WeightEntry | null>(MAT_DIALOG_DATA, { optional: true });

  get isEditMode(): boolean {
    return !!this.entry;
  }

  onWeightAdded(entry: Omit<WeightEntry, 'id'>): void {
    this.dialogRef.close(entry);
  }
}
