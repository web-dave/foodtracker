import { Injectable, signal } from '@angular/core';
import { Schedule, ScheduledTask, DayOfWeek } from '../models/schedule';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly SCHEDULES_KEY = 'foodtracker_schedules';
  private schedules = signal<Schedule[]>(this.loadSchedules());

  readonly schedules$ = this.schedules.asReadonly();

  getSchedules(): Schedule[] {
    return this.schedules();
  }

  getSchedulesForEntryType(entryType: string): Schedule[] {
    return this.schedules().filter(s => s.entryType === entryType && s.enabled);
  }

  getSchedulesForToday(): Schedule[] {
    const today = this.getDayOfWeekName(new Date().getDay());
    return this.schedules().filter(s => s.enabled && s.daysOfWeek.includes(today as DayOfWeek));
  }

  getTasksForToday(): ScheduledTask[] {
    const today = this.getDateKey(new Date());
    const schedules = this.getSchedulesForToday();

    return schedules.map(schedule => ({
      scheduleId: schedule.id,
      entryType: schedule.entryType,
      dueDate: new Date(),
      notes: schedule.notes,
      completed: this.isTaskCompleted(schedule.id, today),
    }));
  }

  addSchedule(schedule: Omit<Schedule, 'id' | 'createdAt'>): Schedule {
    const newSchedule: Schedule = {
      id: this.generateId(),
      ...schedule,
      createdAt: new Date(),
    };
    this.schedules.update(schedules => [...schedules, newSchedule]);
    this.saveSchedules();
    return newSchedule;
  }

  updateSchedule(id: string, updates: Partial<Omit<Schedule, 'id' | 'createdAt'>>): Schedule | null {
    let updated: Schedule | null = null;
    this.schedules.update(schedules =>
      schedules.map(schedule => {
        if (schedule.id === id) {
          updated = { ...schedule, ...updates };
          return updated;
        }
        return schedule;
      })
    );
    if (updated) this.saveSchedules();
    return updated;
  }

  deleteSchedule(id: string): boolean {
    const initialLength = this.schedules().length;
    this.schedules.update(schedules => schedules.filter(s => s.id !== id));
    const deleted = this.schedules().length < initialLength;
    if (deleted) this.saveSchedules();
    return deleted;
  }

  markTaskCompleted(scheduleId: string, date: Date): void {
    const dateKey = this.getDateKey(date);
    const completedKey = `foodtracker_tasks_completed`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || '{}');

    if (!completed[dateKey]) {
      completed[dateKey] = [];
    }

    if (!completed[dateKey].includes(scheduleId)) {
      completed[dateKey].push(scheduleId);
    }

    localStorage.setItem(completedKey, JSON.stringify(completed));
  }

  private isTaskCompleted(scheduleId: string, dateKey: string): boolean {
    const completedKey = `foodtracker_tasks_completed`;
    const completed = JSON.parse(localStorage.getItem(completedKey) || '{}');
    return completed[dateKey]?.includes(scheduleId) || false;
  }

  private getDayOfWeekName(dayIndex: number): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex] as any;
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private loadSchedules(): Schedule[] {
    try {
      const data = localStorage.getItem(this.SCHEDULES_KEY);
      if (!data) return [];
      const schedules = JSON.parse(data) as Schedule[];
      return schedules.map(s => ({
        ...s,
        createdAt: new Date(s.createdAt),
      }));
    } catch (error) {
      console.error('Failed to load schedules:', error);
      return [];
    }
  }

  private saveSchedules(): void {
    try {
      localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(this.schedules()));
    } catch (error) {
      console.error('Failed to save schedules:', error);
    }
  }

  private generateId(): string {
    return `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
