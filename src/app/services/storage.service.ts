import { Injectable, signal } from '@angular/core';
import { Entry, FoodEntry, WeightEntry, SportEntry } from '../models/entries';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'foodtracker_entries';
  private entries = signal<Entry[]>(this.loadEntries());

  readonly entries$ = this.entries.asReadonly();

  getEntries(): Entry[] {
    return this.entries();
  }

  getEntriesByDate(date: Date): Entry[] {
    const dateStr = this.formatDate(date);
    return this.entries().filter(
      entry => this.formatDate(new Date(entry.timestamp)) === dateStr
    );
  }

  getEntriesInRange(startDate: Date, endDate: Date): Entry[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return this.entries().filter(entry => {
      const time = new Date(entry.timestamp).getTime();
      return time >= start && time <= end;
    });
  }

  addEntry(entry: Omit<Entry, 'id'>): Entry {
    const newEntry: Entry = {
      id: this.generateId(),
      ...entry,
    } as Entry;
    this.entries.update(entries => [...entries, newEntry]);
    this.saveEntries();
    return newEntry;
  }

  updateEntry(
    id: string,
    updates: Partial<Omit<Entry, 'id'>>
  ): Entry | null {
    let updated: Entry | null = null;
    this.entries.update(entries =>
      entries.map(entry => {
        if (entry.id === id) {
          updated = { ...entry, ...updates } as Entry;
          return updated;
        }
        return entry;
      })
    );
    if (updated) this.saveEntries();
    return updated;
  }

  deleteEntry(id: string): boolean {
    const initialLength = this.entries().length;
    this.entries.update(entries => entries.filter(e => e.id !== id));
    const deleted = this.entries().length < initialLength;
    if (deleted) this.saveEntries();
    return deleted;
  }

  private loadEntries(): Entry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const entries = JSON.parse(data) as Entry[];
      return entries.map(e => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load entries:', error);
      return [];
    }
  }

  private saveEntries(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.entries()));
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
