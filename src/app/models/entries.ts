export type EntryType = 'food' | 'weight' | 'sport' | 'blood-pressure';

export interface FoodEntry {
  id: string;
  type: 'food';
  timestamp: Date;
  imageUrl?: string;
  description: string;
  nutrition?: NutritionInfo;
  confidence?: number;
}

export interface WeightEntry {
  id: string;
  type: 'weight';
  timestamp: Date;
  weight: number; // in kg
  unit: 'kg' | 'lbs';
  notes?: string;
}

export interface SportEntry {
  id: string;
  type: 'sport';
  timestamp: Date;
  activity: string;
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned?: number;
  notes?: string;
}

export interface BloodPressureEntry {
  id: string;
  type: 'blood-pressure';
  timestamp: Date;
  systolic: number; // mmHg (upper value)
  diastolic: number; // mmHg (lower value)
  heartRate?: number; // beats per minute
  notes?: string;
}

export type Entry = FoodEntry | WeightEntry | SportEntry | BloodPressureEntry;

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sodium?: number; // in mg
  sugar?: number; // in grams
  vitamins?: Record<string, string>;
}
