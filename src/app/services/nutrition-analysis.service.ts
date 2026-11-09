import { Injectable } from '@angular/core';
import { NutritionInfo } from '../models/entries';

@Injectable({
  providedIn: 'root',
})
export class NutritionAnalysisService {
  async analyzeFoodImage(
    imageData: string | Blob
  ): Promise<{
    description: string;
    nutrition: NutritionInfo;
    confidence: number;
  }> {
    // In production, this would call an AI service like:
    // - Google Cloud Vision API with custom nutrition model
    // - OpenAI Vision API with nutrition prompt
    // - Dedicated food recognition API (e.g., Nutritionix, FatSecret)
    // - Custom ML model

    // For now, mock implementation
    return this.mockAnalyzeFood(imageData);
  }

  private mockAnalyzeFood(
    imageData: string | Blob
  ): Promise<{
    description: string;
    nutrition: NutritionInfo;
    confidence: number;
  }> {
    // Simulated AI response
    return Promise.resolve({
      description: 'Grilled salmon with asparagus and lemon',
      nutrition: {
        calories: 450,
        protein: 48,
        carbs: 8,
        fat: 22,
        fiber: 3,
        sodium: 580,
        sugar: 1,
      },
      confidence: 0.85,
    });
  }

  calculateDailyTotals(
    entries: Array<{ nutrition?: NutritionInfo }>
  ): NutritionInfo {
    const initial: NutritionInfo = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      sugar: 0,
    };

    return entries.reduce((totals, entry) => {
      if (!entry.nutrition) return totals;
      return {
        calories: totals.calories + entry.nutrition.calories,
        protein: totals.protein + entry.nutrition.protein,
        carbs: totals.carbs + entry.nutrition.carbs,
        fat: totals.fat + entry.nutrition.fat,
        fiber: (totals.fiber || 0) + (entry.nutrition.fiber || 0),
        sodium: (totals.sodium || 0) + (entry.nutrition.sodium || 0),
        sugar: (totals.sugar || 0) + (entry.nutrition.sugar || 0),
      };
    }, initial);
  }
}
