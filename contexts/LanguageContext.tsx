import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  de: {
    // Settings
    settings: "Einstellungen",
    language: "Sprache",
    theme: "Design",
    lightMode: "Hell",
    darkMode: "Dunkel",
    systemMode: "System",
    privacyPolicy: "Datenschutz",
    termsOfUse: "Nutzungsbedingungen",
    openSource: "Diese App ist Open Source",
    viewOnGithub: "Auf GitHub anschauen",
    aboutTitle: "Über diese App",
    appIcon: "App-Icon",
    notifications: "Benachrichtigungen",
    dailyReminder: "Tägliche Erinnerung",
    dailyReminderDesc: "Erhalte täglich um 18:00 Uhr eine Erinnerung",
    links: "Links",

    // Tab Navigation
    home: "Home",
    exercises: "Übungen",
    history: "Verlauf",
    add: "Hinzufügen",

    // Home Screen
    helloGreeting: "Hallo! 👋",
    readyForMore: "Bereit für mehr?",
    startFirstWorkout: "Starte dein erstes Workout!",
    analyticsWillAppear: "Deine Analytics werden hier angezeigt",
    workouts: "Workouts",
    totalKg: "Total kg",
    exercisesCount: "Übungen",
    topExercisesByVolume: "Top Übungen (Volumen)",
    trend: "Trend",
    kilogram: "Kilogramm",
    customizeHome: "Home anpassen",

    // Customize Home
    customizeHomeTitle: "Home anpassen",
    customizeHomeInfo:
      "Wähle aus, welche Bereiche auf deinem Home Screen angezeigt werden sollen.",
    customizeViewTitle: "Ansicht anpassen",
    progressionAlert: "Progression Alert",
    progressionAlertDesc: "Zeigt Vorschläge für Gewichtssteigerungen",
    statistics: "Statistiken",
    statisticsDesc: "Zeigt Workout-Count, Volumen und Übungen",
    trendChart: "Trend-Diagramm",
    trendChartDesc: "Zeigt den Gewichtsverlauf deiner Top-Übung",
    topExercises: "Top Übungen",
    topExercisesDesc: "Zeigt deine meisttrainierten Übungen",
    tip: "Tipp",
    customizeTip: "Du kannst diese Einstellungen jederzeit ändern.",

    // History Screen
    historyTitle: "Verlauf",
    noHistoryEntries: "Noch keine Trainingseinträge.",
    deleteEntry: "Eintrag löschen?",
    cancel: "Abbrechen",
    delete: "Löschen",

    // Add Screen
    newExercise: "Neue Übung",
    exercisePlaceholder: "z.B. Bankdrücken, Beinpresse...",
    addButton: "Hinzufügen",

    // Exercises Screen
    exercisesTitle: "Übungen",
    noExercises: "Noch keine Übungen.\nTippe + um eine Übung hinzuzufügen!",
    deleteExercise: "Übung löschen?",
    deleteExerciseConfirm: "und alle Einträge löschen?",
    kg: "kg",
    reps: "Wdh",
    entries: "Einträge",
    lastPerformed: "Zuletzt",
    noEntriesTapToAdd: "Noch keine Einträge – tippe zum Hinzufügen",

    // Exercise Detail
    newEntry: "Neuer Eintrag",
    weight: "Gewicht",
    repetitions: "Wiederholungen",
    date: "Datum",
    addEntry: "Eintrag hinzufügen",
    error: "Fehler",
    invalidWeight: "Bitte gültiges Gewicht eingeben.",
    invalidReps: "Bitte gültige Wiederholungen eingeben.",
    personalBest: "Persönlicher Rekord!",
    noEntries: "Noch keine Einträge.",
    noEntriesDesc: "Füge deinen ersten Eintrag hinzu!",
    weightTrend: "Gewichtsverlauf",
    repsTrend: "Wiederholungen",
    volumeTrend: "Volumen",
  },
  en: {
    // Settings
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    lightMode: "Light",
    darkMode: "Dark",
    systemMode: "System",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    openSource: "This app is open source",
    viewOnGithub: "View on GitHub",
    aboutTitle: "About this app",
    appIcon: "App Icon",
    notifications: "Notifications",
    dailyReminder: "Daily Reminder",
    dailyReminderDesc: "Receive a daily reminder at 6:00 PM",
    links: "Links",

    // Tab Navigation
    home: "Home",
    exercises: "Exercises",
    history: "History",
    add: "Add",

    // Home Screen
    helloGreeting: "Hello! 👋",
    readyForMore: "Ready for more?",
    startFirstWorkout: "Start your first workout!",
    analyticsWillAppear: "Your analytics will appear here",
    workouts: "Workouts",
    totalKg: "Total kg",
    exercisesCount: "Exercises",
    topExercisesByVolume: "Top Exercises (Volume)",
    trend: "Trend",
    kilogram: "Kilogram",
    customizeHome: "Customize Home",

    // Customize Home
    customizeHomeTitle: "Customize Home",
    customizeHomeInfo: "Choose which sections to display on your home screen.",
    customizeViewTitle: "Customize View",
    progressionAlert: "Progression Alert",
    progressionAlertDesc: "Shows suggestions for weight increases",
    statistics: "Statistics",
    statisticsDesc: "Shows workout count, volume and exercises",
    trendChart: "Trend Chart",
    trendChartDesc: "Shows weight progression for your top exercise",
    topExercises: "Top Exercises",
    topExercisesDesc: "Shows your most trained exercises",
    tip: "Tip",
    customizeTip: "You can change these settings at any time.",

    // History Screen
    historyTitle: "History",
    noHistoryEntries: "No workout entries yet.",
    deleteEntry: "Delete entry?",
    cancel: "Cancel",
    delete: "Delete",

    // Add Screen
    newExercise: "New Exercise",
    exercisePlaceholder: "e.g. Bench Press, Leg Press...",
    addButton: "Add",

    // Exercises Screen
    exercisesTitle: "Exercises",
    noExercises: "No exercises yet.\nTap + to add an exercise!",
    deleteExercise: "Delete exercise?",
    deleteExerciseConfirm: "and all entries?",
    kg: "kg",
    reps: "Reps",
    entries: "Entries",
    lastPerformed: "Last",
    noEntriesTapToAdd: "No entries yet – tap to add",

    // Exercise Detail
    newEntry: "New Entry",
    weight: "Weight",
    repetitions: "Repetitions",
    date: "Date",
    addEntry: "Add Entry",
    error: "Error",
    invalidWeight: "Please enter a valid weight.",
    invalidReps: "Please enter valid repetitions.",
    personalBest: "Personal Best!",
    noEntries: "No entries yet.",
    noEntriesDesc: "Add your first entry!",
    weightTrend: "Weight Trend",
    repsTrend: "Repetitions",
    volumeTrend: "Volume",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "de",
  setLanguage: () => {},
  t: (key: string) => key,
});

const STORAGE_KEY = "@language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "de" || stored === "en") {
        setLanguageState(stored);
      }
      setLoaded(true);
    });
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }

  function t(key: string): string {
    return translations[language][key] || key;
  }

  if (!loaded) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
