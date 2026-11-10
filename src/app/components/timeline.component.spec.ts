import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { TimelineComponent } from './timeline.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog.component';
import { ScheduleManagementComponent } from './schedule-management/schedule-management.component';

describe('Material replacement for browser dialogs', () => {
  it('uses a Material confirmation dialog when deleting a timeline entry', () => {
    const dialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(true),
      }),
    };

    const snackBar = {
      open: vi.fn(),
    };

    const storageService = {
      deleteEntry: vi.fn(),
    };

    const component = Object.create(TimelineComponent.prototype) as TimelineComponent & {
      storageService: typeof storageService;
      dialog: typeof dialog;
      snackBar: typeof snackBar;
    };

    component.storageService = storageService;
    component.dialog = dialog;
    component.snackBar = snackBar;

    component.deleteEntry('entry-1');

    expect(dialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({ width: '420px' })
    );
    expect(storageService.deleteEntry).toHaveBeenCalledWith('entry-1');
    expect(snackBar.open).toHaveBeenCalledWith('Eintrag gelöscht', 'OK', {
      duration: 2500,
    });
  });

  it('uses a Material confirmation dialog when deleting a schedule', () => {
    const dialog = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(true),
      }),
    };

    const snackBar = {
      open: vi.fn(),
    };

    const scheduleService = {
      deleteSchedule: vi.fn(),
    };

    const component = Object.create(ScheduleManagementComponent.prototype) as ScheduleManagementComponent & {
      scheduleService: typeof scheduleService;
      dialog: typeof dialog;
      snackBar: typeof snackBar;
    };

    component.scheduleService = scheduleService;
    component.dialog = dialog;
    component.snackBar = snackBar;

    component.deleteSchedule('schedule-1');

    expect(dialog.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      expect.objectContaining({ width: '420px' })
    );
    expect(scheduleService.deleteSchedule).toHaveBeenCalledWith('schedule-1');
    expect(snackBar.open).toHaveBeenCalledWith('Zeitplan gelöscht', 'OK', {
      duration: 2500,
    });
  });
});
