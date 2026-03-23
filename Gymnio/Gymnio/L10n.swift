import Foundation

// MARK: - Localization (mirrors LanguageContext.tsx)

enum L10n {
    static func string(_ key: String, language: String) -> String {
        let dict = language == "de" ? de : en
        return dict[key] ?? en[key] ?? key
    }

    // MARK: - German

    private static let de: [String: String] = [
        // Navigation / Tabs
        "nav.home": "Start",
        "nav.exercises": "Übungen",
        "nav.history": "Verlauf",
        "nav.add": "Hinzufügen",

        // Home
        "home.greeting": "Hallo!",
        "home.greeting.morning": "Guten Morgen!",
        "home.greeting.afternoon": "Guten Tag!",
        "home.greeting.evening": "Guten Abend!",
        "home.stats.workouts": "Trainings",
        "home.stats.kg": "Gesamt kg",
        "home.stats.exercises": "Übungen",
        "home.progression.title": "Steigerungsvorschlag",
        "home.progression.body": "Du hast %@ %@ Mal mit %.1f kg gemacht. Versuche %.1f kg!",
        "home.top.title": "Top Übungen",
        "home.top.volume": "%.0f kg Volumen",
        "home.charts.title": "Fortschritt",
        "home.charts.weight": "Gewicht",
        "home.empty": "Noch keine Einträge. Füge deine erste Übung hinzu!",
        "home.customize": "Dashboard anpassen",

        // Exercises
        "exercises.title": "Übungen",
        "exercises.empty": "Noch keine Übungen. Tippe + um eine hinzuzufügen.",
        "exercises.lastWeight": "Letztes Gewicht",
        "exercises.lastReps": "Letzte Wdh.",
        "exercises.entries": "Einträge",
        "exercises.lastDate": "Zuletzt",
        "exercises.noEntries": "Noch keine Einträge – tippe um hinzuzufügen",
        "exercises.delete.title": "Übung löschen",
        "exercises.delete.message": "Möchtest du \"%@\" und alle dazugehörigen Einträge löschen?",

        // Exercise Detail
        "detail.weight": "Gewicht (kg)",
        "detail.reps": "Wiederholungen",
        "detail.date": "Datum",
        "detail.add": "Eintrag hinzufügen",
        "detail.stats.total": "Einträge",
        "detail.stats.maxWeight": "Max. Gewicht",
        "detail.stats.maxReps": "Max. Wdh.",
        "detail.chart.weight": "Gewicht",
        "detail.chart.reps": "Wiederholungen",
        "detail.chart.volume": "Volumen",
        "detail.history.title": "Verlauf",
        "detail.history.empty": "Noch keine Einträge.",
        "detail.pb": "Bestleistung",
        "detail.delete.title": "Eintrag löschen",
        "detail.delete.message": "Möchtest du diesen Eintrag löschen?",

        // History
        "history.title": "Verlauf",
        "history.empty": "Noch keine Einträge.",
        "history.delete.title": "Eintrag löschen",
        "history.delete.message": "Möchtest du diesen Eintrag löschen?",

        // Add Exercise
        "add.title": "Übung hinzufügen",
        "add.placeholder": "Übungsname",
        "add.button": "Hinzufügen",
        "add.cancel": "Abbrechen",
        "add.duplicate": "Diese Übung existiert bereits.",

        // Settings
        "settings.title": "Einstellungen",
        "settings.language": "Sprache",
        "settings.language.de": "Deutsch",
        "settings.language.en": "English",
        "settings.theme": "Darstellung",
        "settings.theme.system": "System",
        "settings.theme.light": "Hell",
        "settings.theme.dark": "Dunkel",
        "settings.notifications": "Tägliche Erinnerung",
        "settings.notifications.sub": "Täglich um 18:00 Uhr",
        "settings.privacy": "Datenschutzrichtlinie",
        "settings.terms": "Nutzungsbedingungen",
        "settings.github": "Open Source auf GitHub",
        "settings.about": "Über Gymnio",
        "settings.section.preferences": "Einstellungen",
        "settings.section.links": "Links",
        "settings.section.about": "Über",

        // Customize Home
        "customize.title": "Dashboard anpassen",
        "customize.progression": "Steigerungsvorschlag",
        "customize.stats": "Statistiken",
        "customize.charts": "Diagramme",
        "customize.top": "Top Übungen",
        "customize.info": "Wähle aus, welche Abschnitte auf deinem Dashboard angezeigt werden.",
        "customize.tip": "Tipp: Aktiviere den Steigerungsvorschlag, um personalisierte Gewichtsempfehlungen zu erhalten.",

        // Common
        "common.cancel": "Abbrechen",
        "common.delete": "Löschen",
        "common.save": "Speichern",
        "common.ok": "OK",
        "common.kg": "kg",
        "common.reps": "Wdh.",
    ]

    // MARK: - English

    private static let en: [String: String] = [
        "nav.home": "Home",
        "nav.exercises": "Exercises",
        "nav.history": "History",
        "nav.add": "Add",

        "home.greeting": "Hello!",
        "home.greeting.morning": "Good morning!",
        "home.greeting.afternoon": "Good afternoon!",
        "home.greeting.evening": "Good evening!",
        "home.stats.workouts": "Workouts",
        "home.stats.kg": "Total kg",
        "home.stats.exercises": "Exercises",
        "home.progression.title": "Progression Suggestion",
        "home.progression.body": "You've done %@ %@ times with %.1f kg. Try %.1f kg!",
        "home.top.title": "Top Exercises",
        "home.top.volume": "%.0f kg volume",
        "home.charts.title": "Progress",
        "home.charts.weight": "Weight",
        "home.empty": "No entries yet. Add your first exercise!",
        "home.customize": "Customize Dashboard",

        "exercises.title": "Exercises",
        "exercises.empty": "No exercises yet. Tap + to add one.",
        "exercises.lastWeight": "Last weight",
        "exercises.lastReps": "Last reps",
        "exercises.entries": "Entries",
        "exercises.lastDate": "Last",
        "exercises.noEntries": "No entries yet – tap to add",
        "exercises.delete.title": "Delete Exercise",
        "exercises.delete.message": "Delete \"%@\" and all its entries?",

        "detail.weight": "Weight (kg)",
        "detail.reps": "Reps",
        "detail.date": "Date",
        "detail.add": "Add Entry",
        "detail.stats.total": "Entries",
        "detail.stats.maxWeight": "Max Weight",
        "detail.stats.maxReps": "Max Reps",
        "detail.chart.weight": "Weight",
        "detail.chart.reps": "Reps",
        "detail.chart.volume": "Volume",
        "detail.history.title": "History",
        "detail.history.empty": "No entries yet.",
        "detail.pb": "Personal Best",
        "detail.delete.title": "Delete Entry",
        "detail.delete.message": "Delete this entry?",

        "history.title": "History",
        "history.empty": "No entries yet.",
        "history.delete.title": "Delete Entry",
        "history.delete.message": "Delete this entry?",

        "add.title": "Add Exercise",
        "add.placeholder": "Exercise name",
        "add.button": "Add",
        "add.cancel": "Cancel",
        "add.duplicate": "This exercise already exists.",

        "settings.title": "Settings",
        "settings.language": "Language",
        "settings.language.de": "Deutsch",
        "settings.language.en": "English",
        "settings.theme": "Appearance",
        "settings.theme.system": "System",
        "settings.theme.light": "Light",
        "settings.theme.dark": "Dark",
        "settings.notifications": "Daily Reminder",
        "settings.notifications.sub": "Every day at 6:00 PM",
        "settings.privacy": "Privacy Policy",
        "settings.terms": "Terms of Use",
        "settings.github": "Open Source on GitHub",
        "settings.about": "About Gymnio",
        "settings.section.preferences": "Preferences",
        "settings.section.links": "Links",
        "settings.section.about": "About",

        "customize.title": "Customize Dashboard",
        "customize.progression": "Progression Alert",
        "customize.stats": "Statistics",
        "customize.charts": "Charts",
        "customize.top": "Top Exercises",
        "customize.info": "Choose which sections appear on your dashboard.",
        "customize.tip": "Tip: Enable the progression alert for personalized weight suggestions.",

        "common.cancel": "Cancel",
        "common.delete": "Delete",
        "common.save": "Save",
        "common.ok": "OK",
        "common.kg": "kg",
        "common.reps": "reps",
    ]
}
