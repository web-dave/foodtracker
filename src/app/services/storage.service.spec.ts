import { beforeEach, describe, expect, it } from 'vitest';
import { StorageService } from './storage.service';
import { WeightEntry } from '../models/entries';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates an existing entry with edited values', () => {
    const service = new StorageService();
    const original = service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-01T08:00:00Z'),
      weight: 74.5,
      unit: 'kg',
      notes: 'vorher',
    } as Omit<WeightEntry, 'id'>);

    const updated = service.updateEntry(original.id, {
      weight: 75.2,
      notes: 'nachher',
    } as Partial<Omit<WeightEntry, 'id'>>);

    const weightEntry = updated as WeightEntry;
    expect(weightEntry.weight).toBe(75.2);
    expect(weightEntry.notes).toBe('nachher');
    const persistedEntry = service.getEntries()[0] as WeightEntry;
    expect(persistedEntry.weight).toBe(75.2);
    expect(JSON.parse(localStorage.getItem('foodtracker_entries') || '[]')[0].notes).toBe('nachher');
  });
});
