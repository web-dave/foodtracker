# 🚀 FoodTracker - Quick Start Guide

## ⚡ Schneller Einstieg (2 Minuten)

### 1. Server starten (falls nicht läuft)
```bash
npm start
```

### 2. Browser öffnen
```
http://localhost:4200
```

## 🎯 Erste Schritte

### A) Essen hinzufügen (📷)
1. Klick auf **"Essen"** Tab
2. Wähle einen Modus:
   - **📷 Kamera**: Foto mit Webcam aufnehmen
   - **📁 Datei**: Bestehendes Foto hochladen
   - **✏️ Manuell**: Nur Text eingeben

3. Optionales KI-Analyse:
   - Klick auf "🤖 Mit KI analysieren"
   - System erkennt automatisch Nährwerte

4. Klick "✅ Speichern"

### B) Gewicht messen (⚖️)
1. Klick auf **"Gewicht"** Input
2. Gib dein Gewicht ein (kg oder lbs)
3. Optionale Notiz (z.B. "Morgens")
4. Klick "✅ Hinzufügen"

### C) Sport protokollieren (🏃)
1. Klick auf **"Sport"** Input
2. Gib ein:
   - Aktivität (z.B. "Joggen")
   - Dauer in Minuten
   - Intensität
3. Klick "✅ Hinzufügen"

## 📅 Navigation

- **📅 Heute**: Sieht die heutige Timeline
- **📆 Kalender**: Durchstöbere andere Tage
- **📊 Analytik**: Sieht Statistiken & Trends

## 💾 Daten

- Alle Daten werden **automatisch gespeichert**
- Daten bleiben auch nach Browser-Neustart erhalten
- Bilder werden komprimiert gespeichert (~100KB pro Foto)

## 🎨 Tipps

- Drücke **Löschen (×)** um Einträge zu entfernen
- Wechsle zwischen **Tag/Woche** in Kalender
- Filtere Analytik nach **Heute/Woche/Monat**
- Alle Views sind **mobil-optimiert**

## 🔧 Troubleshooting

### Kamera funktioniert nicht?
- ✅ Localhost/HTTPS erforderlich
- ✅ Erlaubnis im Browser geben
- ✅ Verschiedenen Browser probieren

### Daten sind weg?
- ✅ localStorage wurde geleert
- ✅ Incognito/Private Mode deaktivieren

### Server läuft nicht?
```bash
# Kill old process
kill <PID>

# Restart
npm start
```

## 📱 Auf Mobilgeräten

1. Öffne `http://<your-ip>:4200` (nicht localhost!)
2. Erlaube Kamera-Zugriff
3. Nutze die Mobil-Kamera für Fotos
4. Alles ist Touch-optimiert!

---

**Viel Spaß beim Tracking! 🎉**

Nächste Schritte: Siehe [IMPLEMENTATION.md](./IMPLEMENTATION.md) für erweiterte Features
