import { Routes } from '@angular/router';
import { TimelineComponent } from './components/timeline.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/today',
    pathMatch: 'full',
  },
  {
    path: 'today',
    component: TimelineComponent,
    data: { title: 'Heute', icon: '📅' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Kalender', icon: '📆' },
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    data: { title: 'Analytik', icon: '📊' },
  },
  {
    path: '**',
    redirectTo: '/today',
  },
];
