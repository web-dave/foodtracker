import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BloodPressureInputComponent } from '../blood-pressure-input/blood-pressure-input.component';
import { BloodPressureEntry } from '../../models/entries';

@Component({
  selector: 'app-blood-pressure-dialog',
  standalone: true,
  imports: [MatDialogModule, BloodPressureInputComponent],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? '💉 Blutdruck bearbeiten' : '💉 Blutdruck erfassen' }}</h2>
    <mat-dialog-content>
      <app-blood-pressure-input
        [entry]="entry"
        (bloodPressureAdded)="onBloodPressureAdded($event)"
      />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Abbrechen</button>
    </mat-dialog-actions>
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
  readonly entry = inject<BloodPressureEntry | null>(MAT_DIALOG_DATA, { optional: true });

  get isEditMode(): boolean {
    return !!this.entry;
  }

  onBloodPressureAdded(entry: Omit<BloodPressureEntry, 'id'>): void {
    this.dialogRef.close(entry);
  }
}
