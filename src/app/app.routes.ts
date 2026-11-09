import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/today',
    pathMatch: 'full',
  },
  {
    path: 'today',
    loadComponent: () =>
      import('./components/timeline.component').then(
        m => m.TimelineComponent
      ),
    data: { title: 'Heute', icon: 'today' },
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./components/calendar/calendar.component').then(
        m => m.CalendarComponent
      ),
    data: { title: 'Kalender', icon: 'calendar_month' },
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./components/analytics/analytics.component').then(
        m => m.AnalyticsComponent
      ),
    data: { title: 'Analytik', icon: 'bar_chart' },
  },
  {
    path: 'schedule',
    loadComponent: () =>
      import('./components/schedule-management/schedule-management.component').then(
        m => m.ScheduleManagementComponent
      ),
    data: { title: 'Zeitplan', icon: 'schedule' },
  },
  {
    path: '**',
    redirectTo: '/today',
  },
];

