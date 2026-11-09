import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-scheduled-tasks',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    @if (tasksForToday().length > 0) {
      <mat-card class="tasks-card">
        <mat-card-header>
          <mat-card-title>📋 Heutige Aufgaben</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="tasks-list">
            @for (task of tasksForToday(); track task.scheduleId) {
              <div class="task-item" [class.completed]="task.completed">
                <div class="task-content">
                  <span class="task-emoji">{{ getEmoji(task.entryType) }}</span>
                  <span class="task-label">{{ getLabel(task.entryType) }}</span>
                  @if (task.notes) {
                    <span class="task-notes">{{ task.notes }}</span>
                  }
                </div>
                @if (task.completed) {
                  <span class="completed-badge">✓ Erledigt</span>
                } @else {
                  <span class="pending-badge">⏳ Ausstehend</span>
                }
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .tasks-card {
      margin-bottom: 24px;
      border-left: 4px solid #f39c12;
      box-shadow: 0 2px 8px rgba(243, 156, 18, 0.1);

      mat-card-header {
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        mat-card-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
      }

      mat-card-content {
        padding: 12px 16px;
      }
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
      border: 1px solid #fde68a;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: linear-gradient(135deg, #fff5cc 0%, #fffbf0 100%);
        box-shadow: 0 2px 6px rgba(243, 156, 18, 0.15);
      }

      &.completed {
        opacity: 0.6;
        background: linear-gradient(135deg, #f0f0f0 0%, #fafafa 100%);
        border-color: #d0d0d0;

        .task-emoji {
          opacity: 0.5;
        }

        .task-label {
          text-decoration: line-through;
          color: #999;
        }
      }
    }

    .task-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }

    .task-emoji {
      font-size: 18px;
      flex-shrink: 0;
    }

    .task-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .task-notes {
      font-size: 12px;
      color: #666;
      font-style: italic;
      margin-left: 4px;
    }

    .completed-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      padding: 4px 8px;
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
      border-radius: 4px;
      font-weight: 500;
      flex-shrink: 0;
    }

    .pending-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      padding: 4px 8px;
      background: rgba(243, 156, 18, 0.15);
      color: #f39c12;
      border-radius: 4px;
      font-weight: 500;
      flex-shrink: 0;
    }

    @media (max-width: 500px) {
      .task-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .task-content {
        width: 100%;
      }

      .completed-badge,
      .pending-badge {
        align-self: flex-end;
      }
    }
  `,
})
export class ScheduledTasksComponent {
  private scheduleService = inject(ScheduleService);

  tasksForToday = computed(() => this.scheduleService.getTasksForToday());

  getEmoji(entryType: string): string {
    const emojis: Record<string, string> = {
      food: '🍽️',
      weight: '⚖️',
      sport: '🏃',
      'blood-pressure': '💉',
    };
    return emojis[entryType] || '📝';
  }

  getLabel(entryType: string): string {
    const labels: Record<string, string> = {
      food: 'Essen erfassen',
      weight: 'Gewicht erfassen',
      sport: 'Sport erfassen',
      'blood-pressure': 'Blutdruck erfassen',
    };
    return labels[entryType] || 'Eintrag erfassen';
  }
}
