import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FoodDialogComponent } from './food-dialog.component';

describe('FoodDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, FoodDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 'entry-1',
            type: 'food',
            timestamp: new Date(),
            name: 'Toast',
            mealType: 'breakfast',
            mealNumber: 1,
            totalMeals: 3,
            quantity: '1 Stk',
            calories: 150,
            protein: 5,
            carbs: 20,
            fat: 3,
          },
        },
      ],
    }).compileComponents();
  });

  it('shows a cancel button in edit mode', () => {
    const fixture = TestBed.createComponent(FoodDialogComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Abbrechen');
  });
});
