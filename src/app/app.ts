import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';

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
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <!-- Mobile Header -->
    <mat-toolbar color="primary" class="mobile-toolbar">
      <h1 class="app-title">🍽️ Food Tracker</h1>
      <button mat-icon-button (click)="sidenav.toggle()" class="desktop-menu-btn">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <!-- Desktop Sidenav + Content Layout -->
    <mat-sidenav-container class="sidenav-container">
      <!-- Desktop Sidebar Navigation -->
      <mat-sidenav #sidenav class="desktop-sidenav" mode="side" [opened]="true">
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <mat-list-item
              (click)="navigateTo(item.route)"
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </mat-list-item>
          }
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main Content Area -->
      <mat-sidenav-content class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>

        <!-- Mobile Bottom Navigation Tabs -->
        <mat-tab-group
          class="mobile-bottom-nav"
          [selectedIndex]="selectedTabIndex()"
          (selectedIndexChange)="onTabChanged($event)"
          animationDuration="0"
        >
          @for (item of navItems; track item.route) {
            <mat-tab [label]="item.label">
              <ng-template mat-tab-icon>
                <mat-icon>{{ item.icon }}</mat-icon>
              </ng-template>
            </mat-tab>
          }
        </mat-tab-group>
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

    .mobile-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 100;
      height: 56px;

      .app-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        flex: 1;
      }

      .desktop-menu-btn {
        display: none;

        @media (min-width: 768px) {
          display: block;
        }
      }
    }

    .sidenav-container {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: row;
    }

    .desktop-sidenav {
      width: 280px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      display: none;
      background: white;

      @media (min-width: 768px) {
        display: block;
      }

      mat-nav-list {
        padding: 16px 0;
      }

      .nav-item {
        cursor: pointer;
        border-radius: 4px;
        margin: 8px 12px;
        transition: all 0.2s ease;
        height: 48px;

        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }

        &.active {
          background-color: rgba(102, 126, 234, 0.1);
          color: #667eea;
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
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
      position: relative;
    }

    .content-wrapper {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 72px;

      @media (min-width: 768px) {
        padding-bottom: 0;
      }
    }

    /* Mobile Bottom Navigation */
    .mobile-bottom-nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: block;
      height: 56px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

      @media (min-width: 768px) {
        display: none;
      }

      ::ng-deep {
        .mat-mdc-tab-labels {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: white;
          border-bottom: none;
        }

        .mat-mdc-tab {
          min-width: 0;
          width: 33.333%;
          padding: 0;
          flex: 1;

          &.mat-mdc-tab-active {
            .mat-mdc-tab-header-content {
              color: #667eea;
            }
          }
        }

        .mat-mdc-tab-header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          color: #666;
          font-size: 12px;
          padding: 0;
          min-height: 56px;
          transition: color 0.2s ease;
        }

        .mat-mdc-tab-body-wrapper {
          display: none;
        }

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }
    }

    @media (min-width: 768px) {
      .sidenav-container {
        flex-direction: row;
      }

      .main-content {
        position: static;
      }
    }
  `,
})
export class App {
  navItems: NavItem[] = [
    { label: 'Heute', route: '/today', icon: 'today' },
    { label: 'Kalender', route: '/calendar', icon: 'calendar_month' },
    { label: 'Analytik', route: '/analytics', icon: 'bar_chart' },
  ];

  @ViewChild('sidenav') sidenav: any;

  selectedTabIndex = signal(0);

  constructor(private router: Router) {
    // Track route changes to update tab selection
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const index = this.navItems.findIndex(
          item => item.route === `/${event.url.split('/')[1]}`
        );
        if (index !== -1) {
          this.selectedTabIndex.set(index);
        }
      });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onTabChanged(index: number): void {
    if (index >= 0 && index < this.navItems.length) {
      this.navigateTo(this.navItems[index].route);
    }
  }
}
