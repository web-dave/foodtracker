import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BloodPressureInputComponent } from '../blood-pressure-input/blood-pressure-input.component';
import { BloodPressureEntry } from '../../models/entries';

@Component({
  selector: 'app-blood-pressure-dialog',
  standalone: true,
  imports: [MatDialogModule, BloodPressureInputComponent],
  template: `
    <h2 mat-dialog-title>💉 Blutdruck erfassen</h2>
    <mat-dialog-content>
      <app-blood-pressure-input (bloodPressureAdded)="onBloodPressureAdded($event)" />
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
export class BloodPressureDialogComponent {
  private dialogRef = inject(MatDialogRef<BloodPressureDialogComponent>);

  onBloodPressureAdded(entry: Omit<BloodPressureEntry, 'id'>): void {
    this.dialogRef.close(entry);
  }
}
