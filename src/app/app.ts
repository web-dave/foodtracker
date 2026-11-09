import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopilotChat } from '@copilotkit/angular';
import { TimelineComponent } from './components/timeline.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CopilotChat, TimelineComponent, CalendarComponent, AnalyticsComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🍽️ Food Tracker</h1>
        <nav class="nav-tabs">
          <button
            (click)="setView('timeline')"
            [class.active]="currentView() === 'timeline'"
            class="nav-tab"
          >
            📅 Heute
          </button>
          <button
            (click)="setView('calendar')"
            [class.active]="currentView() === 'calendar'"
            class="nav-tab"
          >
            📆 Kalender
          </button>
          <button
            (click)="setView('analytics')"
            [class.active]="currentView() === 'analytics'"
            class="nav-tab"
          >
            📊 Analytik
          </button>
        </nav>
      </header>

      <main class="app-main">
        @if (currentView() === 'timeline') {
          <app-timeline />
        }
        @if (currentView() === 'calendar') {
          <app-calendar />
        }
        @if (currentView() === 'analytics') {
          <app-analytics />
        }
      </main>
    </div>
  `,
  styles: `
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h1 {
        margin: 0 0 20px 0;
        font-size: 28px;
        text-align: center;
      }
    }

    .nav-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .nav-tab {
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }

      &.active {
        background: white;
        color: #667eea;
        border-color: white;
      }
    }

    .app-main {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    @media (max-width: 600px) {
      .app-header {
        padding: 16px;

        h1 {
          font-size: 22px;
          margin-bottom: 16px;
        }
      }

      .nav-tabs {
        gap: 8px;
      }

      .nav-tab {
        padding: 8px 16px;
        font-size: 12px;
      }

      .app-main {
        padding: 12px;
      }
    }
  `,
})
export class App {
  protected readonly title = signal('foodtracker');
  currentView = signal<'timeline' | 'calendar' | 'analytics'>('timeline');

  setView(view: 'timeline' | 'calendar' | 'analytics'): void {
    this.currentView.set(view);
  }
}
