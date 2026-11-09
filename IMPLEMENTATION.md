# FoodTracker - Dokumentation

Ein umfassendes Angular-basiertes Lebensmitteltracking-System mit Fotografie, Nährwertanalyse und Fortschrittsverfolgung.

## Features

### 1. **Timeline-Ansicht (Heute)**
- Tägliche Übersicht aller Einträge (Essen, Gewicht, Sport)
- Chronologisch sortierte Einträge mit Zeitangabe
- Schnelle Ansicht von Fotos und Nährwerten
- Löschen von Einträgen mit Bestätigung

### 2. **Essen-Erfassung**
- **Drei Erfassungsmodi:**
  - 📷 **Kamera**: Fotos direkt mit der Webcam/Mobilkamera aufnehmen
  - 📁 **Datei-Upload**: Bestehende Bilder hochladen
  - ✏️ **Manuell**: Textbeschreibung ohne Foto

- **KI-gestützte Nährwertanalyse:**
  - Automatische Erkennung von Lebensmitteln im Foto
  - Geschätzte Nährwerte (Kalorien, Protein, Kohlenhydrate, Fett)
  - Konfidenz-Anzeige für die Genauigkeit

- **Speicherung:**
  - Foto wird im Browser lokal gespeichert
  - Nährwertdaten werden mit dem Eintrag verknüpft

### 3. **Gewicht-Tracking**
- Gewichtsmessung mit Einheit (kg/lbs)
- Optionale Notizen (z.B. "Morgens gemessen")
- Zeitstempel automatisch erfasst

### 4. **Sport-Protokoll**
- Aktivitätsname (z.B. "Joggen", "Radfahren")
- Dauer in Minuten
- Intensitätsstufe (Leicht, Moderat, Intensiv)
- Geschätzte verbrannte Kalorien
- Optionale Notizen

### 5. **Kalender-Ansicht**
- **Monatsansicht:**
  - Interaktiver Kalender
  - Tage auswählen zur Detailansicht
  - Heutige Tag hervorgehoben

- **Wochenansicht:**
  - 7-Tage-Übersicht
  - Navigation zwischen Wochen
  - Wochenbereich wird angezeigt

### 6. **Analyse & Fortschritt**
- **Ernährungsanalyse:**
  - Tägliche Nährwert-Zusammenfassung
  - Makronährstoff-Verteilung (Protein, Kohlenhydrate, Fett)
  - Kalorienzähler

- **Gewichtsverfolgung:**
  - Aktuelle Messung
  - Durchschnittsgewicht
  - Gewichtsdifferenz (Trend)

- **Sportanalyse:**
  - Anzahl der Trainingseinheiten
  - Gesamtdauer aller Trainings
  - Summe verbrannter Kalorien

- **Zeiträume:**
  - Heute (nur heutiger Tag)
  - Diese Woche (letzte 7 Tage)
  - Diesen Monat (letzte 30 Tage)

## Architektur

### Ordnerstruktur

```
src/app/
├── models/
│   └── entries.ts          # TypeScript Interfaces für Datentypes
├── services/
│   ├── storage.service.ts  # Lokale Datenverwaltung (localStorage)
│   └── nutrition-analysis.service.ts  # KI-Integration & Nährwertberechnungen
├── components/
│   ├── timeline.component.ts         # Haupt-Timeline
│   ├── calendar/
│   │   └── calendar.component.ts     # Kalender-Komponente
│   ├── analytics/
│   │   └── analytics.component.ts    # Analyse-Dashboard
│   ├── food-capture/
│   │   └── food-capture.component.ts # Essen-Erfassung
│   ├── weight-input/
│   │   └── weight-input.component.ts # Gewicht-Eingabe
│   ├── sport-input/
│   │   └── sport-input.component.ts  # Sport-Eingabe
│   └── entry-items/                  # Einzelne Eintrag-Komponenten
│       ├── entry-food.component.ts
│       ├── entry-weight.component.ts
│       └── entry-sport.component.ts
├── app.ts                  # Haupt-App-Komponente
└── ...
```

### Datenmodelle

```typescript
// Essen-Eintrag
interface FoodEntry {
  id: string;
  type: 'food';
  timestamp: Date;
  imageUrl?: string;
  description: string;
  nutrition?: NutritionInfo;
  confidence?: number;  // 0-1
}

// Gewicht-Eintrag
interface WeightEntry {
  id: string;
  type: 'weight';
  timestamp: Date;
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
}

// Sport-Eintrag
interface SportEntry {
  id: string;
  type: 'sport';
  timestamp: Date;
  activity: string;
  duration: number;  // Minuten
  intensity: 'low' | 'moderate' | 'high';
  caloriesBurned?: number;
  notes?: string;
}

// Nährwertinfo
interface NutritionInfo {
  calories: number;
  protein: number;  // Gramm
  carbs: number;    // Gramm
  fat: number;      // Gramm
  fiber?: number;
  sodium?: number;
  sugar?: number;
  vitamins?: Record<string, string>;
}
```

### Services

#### StorageService
- Verwaltet alle Einträge mit localStorage
- **Methoden:**
  - `getEntriesByDate(date)`: Einträge für einen bestimmten Tag
  - `getEntriesInRange(start, end)`: Einträge in einem Zeitraum
  - `addEntry(entry)`: Neuen Eintrag hinzufügen
  - `updateEntry(id, updates)`: Eintrag aktualisieren
  - `deleteEntry(id)`: Eintrag löschen
  - `entries$`: Observable mit allen Einträgen

#### NutritionAnalysisService
- Analysiert Lebensmittelfotos mit KI
- Berechnet Nährwert-Aggregate
- **Methoden:**
  - `analyzeFoodImage(imageData)`: KI-Analyse des Fotos
  - `calculateDailyTotals(entries)`: Summiert Nährwerte

## Verwendung

### Installation

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm start
```

Der Server läuft auf `http://localhost:4200/`

### Build für Produktion

```bash
npm run build
```

## Technologie-Stack

- **Angular 22**: Modernes Frontend-Framework
- **Angular Signals**: Reaktive State-Management
- **TypeScript**: Type-safe JavaScript
- **localStorage**: Lokale Datenspeicherung (keine Serverzugriffe)
- **WebAPI Camera**: Zugriff auf Geräte-Kamera
- **CSS3**: Responsive Design

## Zukünftige Verbesserungen

### Phase 2 (Geplant):
- ✅ Backend-Integration (Node.js/Express)
- ✅ Benutzerauthentifizierung
- ✅ Cloud-Synchronisation
- ✅ Export zu CSV/PDF
- ✅ Diagramme & Grafiken für Trends
- ✅ Benachrichtigungen & Erinnerungen

### Phase 3 (Geplant):
- ✅ Mobile-App (React Native/Flutter)
- ✅ Wearable-Integration (Apple Watch, Fitbit)
- ✅ Machine Learning Modelle für bessere KI-Erkennung
- ✅ Rezept-Datenbank
- ✅ Soziale Features (Freunde, Challenges)

## Performance-Optimierungen

- Signals für effiziente Change Detection
- Lazy Loading von Komponenten
- LocalStorage für schnelle Datenzugriffe
- Responsive Design für alle Geräte
- Optimierte Bildformate für Speicherung

## Browser-Kompatibilität

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Browser (iOS Safari, Chrome Mobile)

**Hinweis:** Kamera-Zugriff benötigt HTTPS oder localhost

## Lizenz

MIT

---

**Autor:** Copilot  
**Datum:** November 2026
