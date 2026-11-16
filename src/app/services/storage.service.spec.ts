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

  it('returns entries sorted by date and time descending', () => {
    const service = new StorageService();

    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-01T08:00:00Z'),
      weight: 80,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);
    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-01T12:30:00Z'),
      weight: 79.5,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);
    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-02T07:15:00Z'),
      weight: 79,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);

    const entries = service.getEntries() as WeightEntry[];

    expect(entries.map(entry => entry.timestamp.toISOString())).toEqual([
      '2024-01-02T07:15:00.000Z',
      '2024-01-01T12:30:00.000Z',
      '2024-01-01T08:00:00.000Z',
    ]);
  });

  it('returns entries of one day sorted by time descending', () => {
    const service = new StorageService();

    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-01T06:00:00Z'),
      weight: 80,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);
    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-01T19:45:00Z'),
      weight: 79.2,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);
    service.addEntry({
      type: 'weight',
      timestamp: new Date('2024-01-02T09:10:00Z'),
      weight: 79,
      unit: 'kg',
    } as Omit<WeightEntry, 'id'>);

    const entries = service.getEntriesByDate(new Date('2024-01-01T00:00:00Z')) as WeightEntry[];

    expect(entries.length).toBe(2);
    expect(entries.map(entry => entry.timestamp.toISOString())).toEqual([
      '2024-01-01T19:45:00.000Z',
      '2024-01-01T06:00:00.000Z',
    ]);
  });
});
