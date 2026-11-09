export type ScheduleEntryType = 'food' | 'weight' | 'sport' | 'blood-pressure';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Schedule {
  id: string;
  entryType: ScheduleEntryType;
  daysOfWeek: DayOfWeek[];
  time?: string; // HH:mm format (optional)
  notes?: string;
  enabled: boolean;
  createdAt: Date;
}

export interface ScheduledTask {
  scheduleId: string;
  entryType: ScheduleEntryType;
  dueDate: Date;
  notes?: string;
  completed: boolean;
}
