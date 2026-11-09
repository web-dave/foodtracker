import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WeightInputComponent } from '../weight-input/weight-input.component';
import { WeightEntry } from '../../models/entries';

@Component({
  selector: 'app-weight-dialog',
  standalone: true,
  imports: [MatDialogModule, WeightInputComponent],
  template: `
    <h2 mat-dialog-title>⚖️ Gewicht erfassen</h2>
    <mat-dialog-content>
      <app-weight-input (weightAdded)="onWeightAdded($event)" />
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

  onWeightAdded(entry: Omit<WeightEntry, 'id'>): void {
    this.dialogRef.close(entry);
  }
}
