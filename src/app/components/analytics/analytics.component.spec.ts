import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { AnalyticsComponent } from './analytics.component';
import { FoodLogDialogComponent } from '../dialogs/food-log-dialog.component';
import { FoodEntry } from '../../models/entries';

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

  it('opens the food log dialog with selected period entries', () => {
    const component = Object.create(AnalyticsComponent.prototype) as AnalyticsComponent & {
      dialog: { open: ReturnType<typeof vi.fn> };
      foodEntries: () => FoodEntry[];
      selectedPeriod: () => 'day' | 'week' | 'month';
    };

    const dialogOpen = vi.fn();
    const entries: FoodEntry[] = [
      { id: 'f1', type: 'food', timestamp: new Date('2024-01-14T08:00:00Z'), description: 'Haferflocken', mealType: 'breakfast' },
    ];

    component.dialog = { open: dialogOpen };
    component.foodEntries = () => entries;
    component.selectedPeriod = () => 'week';

    component.showFoodLog();

    expect(dialogOpen).toHaveBeenCalledTimes(1);
    const [, config] = dialogOpen.mock.calls[0];
    expect(config.data.entries).toBe(entries);
    expect(config.data.periodLabel).toBe('Diese Woche');
  });

  it('hides zero and null nutrition values in the food log dialog', () => {
    const component = Object.create(FoodLogDialogComponent.prototype) as FoodLogDialogComponent;

    const entry: FoodEntry = {
      id: 'f1',
      type: 'food',
      timestamp: new Date('2024-01-14T08:00:00Z'),
      description: 'Haferflocken',
      mealType: 'breakfast',
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: null as unknown as number,
      },
    };

    expect(component.getNutritionSummary(entry)).toBe('');

    const entryWithValues: FoodEntry = {
      ...entry,
      nutrition: {
        calories: 320,
        protein: 12,
        carbs: 40,
        fat: 6,
      },
    };

    expect(component.getNutritionSummary(entryWithValues)).toBe('320 kcal · 12g Protein · 40g Kohlenhydrate · 6g Fett');
  });
});
