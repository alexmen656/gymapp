import Foundation
import SwiftUI
import Combine

final class AppStore: ObservableObject {
    static let shared = AppStore()

    private let storage = WorkoutStorage.shared
    private let defaults = UserDefaults.standard

    @Published var exercises: [String] = []
    @Published var entries: [WorkoutEntry] = []
    @Published var language: String = "de"
    @Published var homeSettings: HomeViewSettings = HomeViewSettings()
    @Published var themeMode: String = "system"   // "system" | "light" | "dark"
    @Published var showAddExercise: Bool = false

    private let languageKey = "@language"
    private let homeSettingsKey = "homeViewSettings"
    private let themeKey = "@theme_mode"

    init() {
        configureForUITestsIfNeeded()
        loadAll()
    }

    // MARK: - Load

    func loadAll() {
        exercises = storage.getExercises()
        entries = storage.getAllEntries()
        language = defaults.string(forKey: languageKey) ?? "de"
        themeMode = defaults.string(forKey: themeKey) ?? "system"
        if let data = defaults.data(forKey: homeSettingsKey),
           let s = try? JSONDecoder().decode(HomeViewSettings.self, from: data) {
            homeSettings = s
        }
    }

    func reload() {
        exercises = storage.getExercises()
        entries = storage.getAllEntries()
    }

    // MARK: - Exercises

    func addExercise(_ name: String) {
        storage.addExercise(name)
        exercises = storage.getExercises()
    }

    func deleteExercise(_ name: String) {
        storage.deleteExercise(name)
        exercises = storage.getExercises()
        entries = storage.getAllEntries()
    }

    // MARK: - Entries

    func addEntry(exercise: String, weight: Double, reps: Int, date: Date) {
        let entry = WorkoutEntry.create(exercise: exercise, weight: weight, reps: reps, date: date)
        storage.saveEntry(entry)
        entries = storage.getAllEntries()
        checkMilestones()
    }

    func deleteEntry(id: String) {
        storage.deleteEntry(id: id)
        entries = storage.getAllEntries()
    }

    // MARK: - Settings

    func setLanguage(_ lang: String) {
        language = lang
        defaults.set(lang, forKey: languageKey)
    }

    func setThemeMode(_ mode: String) {
        themeMode = mode
        defaults.set(mode, forKey: themeKey)
    }

    func saveHomeSettings(_ s: HomeViewSettings) {
        homeSettings = s
        if let data = try? JSONEncoder().encode(s) {
            defaults.set(data, forKey: homeSettingsKey)
        }
    }

    // MARK: - Derived data

    func entriesForExercise(_ name: String) -> [WorkoutEntry] {
        entries.filter { $0.exercise == name }.sorted { $0.date < $1.date }
    }

    func groupedExercises() -> [ExerciseGroup] {
        storage.groupByExercise()
    }

    // MARK: - Milestones

    private func checkMilestones() {
        let count = entries.count
        let milestones = [10, 25, 50, 100, 200]
        if milestones.contains(count) {
            NotificationManager.shared.sendCelebrationNotification(entryCount: count, language: language)
        }
        if count == 5 {
            NotificationManager.shared.requestPermissions()
        }
    }

    // MARK: - Computed theme

    var colorScheme: ColorScheme? {
        switch themeMode {
        case "light": return .light
        case "dark": return .dark
        default: return nil
        }
    }

    // MARK: - Translation helper

    func t(_ key: String) -> String {
        L10n.string(key, language: language)
    }

    // MARK: - UI tests

    private func configureForUITestsIfNeeded() {
        let args = ProcessInfo.processInfo.arguments
        guard args.contains("-ui_testing") else { return }

        storage.resetAll()
        defaults.removeObject(forKey: languageKey)
        defaults.removeObject(forKey: homeSettingsKey)
        defaults.removeObject(forKey: themeKey)

        let lang = value(after: "-ui_test_language", in: args) ?? "de"
        defaults.set(lang, forKey: languageKey)
        defaults.set("system", forKey: themeKey)

        if args.contains("-ui_test_seed_demo_data") {
            seedDemoDataForUITests()
        }
    }

    private func value(after key: String, in args: [String]) -> String? {
        guard let i = args.firstIndex(of: key), i + 1 < args.count else { return nil }
        return args[i + 1]
    }

    private func seedDemoDataForUITests() {
        let baseDate = Date()
        let calendar = Calendar.current

        let demo: [(exercise: String, weights: [Double], reps: [Int])] = [
            (
                exercise: "Bankdruecken",
                weights: [70.0, 75.0, 80.0, 80.0, 80.0, 80.0, 80.0],
                reps: [8, 8, 6, 6, 6, 6, 6]
            ),
            (
                exercise: "Kniebeuge",
                weights: [95.0, 100.0, 102.5, 105.0, 107.5, 110.0],
                reps: [10, 8, 8, 6, 6, 5]
            ),
            (
                exercise: "Kreuzheben",
                weights: [110.0, 115.0, 120.0, 125.0, 130.0],
                reps: [6, 5, 5, 4, 3]
            )
        ]

        for item in demo {
            storage.addExercise(item.exercise)
            for idx in item.weights.indices {
                let offset = -(item.weights.count - idx)
                let date = calendar.date(byAdding: .day, value: offset, to: baseDate) ?? baseDate
                let entry = WorkoutEntry.create(
                    exercise: item.exercise,
                    weight: item.weights[idx],
                    reps: item.reps[idx],
                    date: date
                )
                storage.saveEntry(entry)
            }
        }
    }
}
