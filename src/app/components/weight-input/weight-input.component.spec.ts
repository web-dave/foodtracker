import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { WeightInputComponent } from './weight-input.component';
import { WeightEntry } from '../../models/entries';

describe('WeightInputComponent', () => {
  it('uses the selected time when emitting an entry', () => {
    const emitted = vi.fn();
    const baseTimestamp = new Date(2024, 0, 5, 7, 30, 0, 0);

    const component = Object.create(WeightInputComponent.prototype) as WeightInputComponent & {
      entry: () => WeightEntry;
      weightAdded: { emit: (entry: Omit<WeightEntry, 'id'>) => void };
    };

    component.entry = () =>
      ({
        id: 'weight-1',
        type: 'weight',
        timestamp: baseTimestamp,
        weight: 80,
        unit: 'kg',
      }) as WeightEntry;
    component.weightAdded = { emit: emitted };
    component.weight = 79.4;
    component.unit = 'kg';
    component.notes = 'Abends';
    component.entryTime = '19:45';

    component.submit();

    expect(emitted).toHaveBeenCalledTimes(1);
    const entry = emitted.mock.calls[0][0] as Omit<WeightEntry, 'id'>;
    const timestamp = new Date(entry.timestamp);
    expect(timestamp.getFullYear()).toBe(2024);
    expect(timestamp.getMonth()).toBe(0);
    expect(timestamp.getDate()).toBe(5);
    expect(timestamp.getHours()).toBe(19);
    expect(timestamp.getMinutes()).toBe(45);
  });
});
