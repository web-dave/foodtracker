import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SportInputComponent } from '../sport-input/sport-input.component';
import { SportEntry } from '../../models/entries';

@Component({
  selector: 'app-sport-dialog',
  standalone: true,
  imports: [MatDialogModule, SportInputComponent],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? '🏃 Sport bearbeiten' : '🏃 Sport erfassen' }}</h2>
    <mat-dialog-content>
      <app-sport-input [entry]="entry" (sportAdded)="onSportAdded($event)" />
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
export class SportDialogComponent {
  private dialogRef = inject(MatDialogRef<SportDialogComponent>);
  readonly entry = inject<SportEntry | null>(MAT_DIALOG_DATA, { optional: true });

  get isEditMode(): boolean {
    return !!this.entry;
  }

  onSportAdded(entry: Omit<SportEntry, 'id'>): void {
    this.dialogRef.close(entry);
  }
}
