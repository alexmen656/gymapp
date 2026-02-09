# Gym Logbook 💪

Eine React Native Expo App zum Protokollieren deiner Trainingseinheiten.

## Features

- **Geräte-Übersicht**: Alle trainierten Geräte/Übungen auf der Startseite
- **Training eintragen**: Gerät, Gewicht (kg) und Wiederholungen eingeben
- **Automatisches Datum**: Heutiges Datum wird automatisch gesetzt, vergangene Trainings können rückwirkend eingetragen werden
- **Verlauf**: Alle Einträge chronologisch anzeigen
- **Detail-Ansicht**: Pro Gerät alle Einträge mit Personal Records (PR) sehen
- **Auto-Vervollständigung**: Bereits genutzte Gerätenamen werden vorgeschlagen
- **Dark Mode**: Unterstützt automatisch das Systemdesign

## Tech Stack

- **React Native** mit **Expo SDK 54**
- **Expo Router** (dateibasiertes Routing)
- **AsyncStorage** (lokale Datenspeicherung)
- **TypeScript**

## Starten

```bash
# Abhängigkeiten installieren
npm install

# App starten
npx expo start
```

Danach mit der **Expo Go** App auf dem Handy den QR-Code scannen oder einen Simulator verwenden.

## Projektstruktur

```
app/
  (tabs)/
    index.tsx      – Startseite: alle Geräte
    add.tsx        – Neuen Eintrag hinzufügen
    history.tsx    – Trainings-Verlauf
  exercise/
    [name].tsx     – Detail-Ansicht pro Gerät
storage/
  workoutStorage.ts – AsyncStorage CRUD-Operationen
types/
  workout.ts       – TypeScript-Typen
```
