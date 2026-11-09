import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()" class="menu-btn">
        <mat-icon>menu</mat-icon>
      </button>
      <h1 class="app-title">🍽️ Food Tracker</h1>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav class="sidenav">
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <mat-list-item
              (click)="navigate(item.route); sidenav.close()"
              [routerLink]="item.route"
              routerLinkActive="active"
            >
              <mat-icon matListItemIcon>
                {{ getIconForRoute(item.icon) }}
              </mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </mat-list-item>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
      overflow: hidden;
    }

    .app-toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 100;

      .app-title {
        margin: 0;
        flex: 1;
        font-size: 24px;
        font-weight: 500;
      }

      .menu-btn {
        @media (min-width: 768px) {
          display: none;
        }
      }
    }

    .sidenav-container {
      flex: 1;
      overflow: hidden;
    }

    .sidenav {
      width: 280px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);

      @media (max-width: 767px) {
        width: 240px;
      }

      mat-nav-list {
        padding: 16px 0;
      }

      mat-list-item {
        cursor: pointer;
        font-size: 16px;
        border-radius: 4px;
        margin: 8px 12px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        &.active {
          background-color: rgba(0, 0, 0, 0.08);
          color: var(--primary-color, #3f51b5);
          font-weight: 600;
        }

        mat-icon {
          font-size: 24px;
          margin-right: 12px;
          color: inherit;
        }
      }
    }

    .main-content {
      flex: 1;
      overflow: auto;
      background: #f5f5f5;
    }

    .content-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 768px) {
      .app-toolbar .menu-btn {
        display: none;
      }

      .sidenav {
        visibility: visible;
        position: relative;
        transform: none;
      }
    }
  `,
})
export class App {
  navItems: NavItem[] = [
    { label: 'Heute', route: '/today', icon: '📅' },
    { label: 'Kalender', route: '/calendar', icon: '📆' },
    { label: 'Analytik', route: '/analytics', icon: '📊' },
  ];

  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getIconForRoute(emoji: string): string {
    const iconMap: { [key: string]: string } = {
      '📅': 'today',
      '📆': 'calendar_month',
      '📊': 'bar_chart',
    };
    return iconMap[emoji] || 'home';
  }
}

