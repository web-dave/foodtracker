import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { AnalyticsComponent } from './analytics.component';

describe('AnalyticsComponent', () => {
  it('sorts weight entries chronologically and calculates the loss summary', () => {
    const component = Object.create(AnalyticsComponent.prototype) as AnalyticsComponent & {
      weightEntries: () => any[];
    };

    const entries = [
      { id: '2', type: 'weight', timestamp: new Date('2024-01-14T08:00:00Z'), weight: 84.5 },
      { id: '1', type: 'weight', timestamp: new Date('2024-01-10T08:00:00Z'), weight: 87.5 },
      { id: '3', type: 'weight', timestamp: new Date('2024-01-20T08:00:00Z'), weight: 82.5 },
    ];

    component.weightEntries = () => entries;

    expect(component.getSortedWeightEntries().map(e => e.id)).toEqual(['1', '2', '3']);
    expect(component.getWeightDifference()).toBe(-5);
    expect(component.getWeightLossText()).toBe('5,0 kg verloren');
    expect(component.getWeightChartPath()).toContain('M');
    expect(component.getWeightChartPoints().length).toBe(3);
    expect(component.getWeightChartDateLabels().map(label => label.text)).toEqual(['10.01', '14.01', '20.01']);
    expect(component.getWeightChartValueLabels().map(label => label.text)).toEqual(['87,5 kg', '84,5 kg', '82,5 kg']);
  });
});
