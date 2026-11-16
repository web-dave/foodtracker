import '@angular/compiler';
import { describe, expect, it, vi } from 'vitest';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    const router = { events: new Subject(), navigate: vi.fn() };
    const app = new App(router as any);

    expect(app).toBeTruthy();
    expect(app.navItems.length).toBeGreaterThan(0);
  });

  it('should update the selected mobile tab when the route changes', () => {
    const router = { events: new Subject(), navigate: vi.fn() };
    const app = new App(router as any);

    router.events.next(new NavigationEnd(1, '/calendar', '/calendar'));

    expect(app.selectedTabIndex()).toBe(1);
  });

  it('should navigate to the selected tab route', () => {
    const router = { events: new Subject(), navigate: vi.fn() };
    const app = new App(router as any);

    app.onTabChanged(3);

    expect(router.navigate).toHaveBeenCalledWith(['/schedule']);
  });
});
