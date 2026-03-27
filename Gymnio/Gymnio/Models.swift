import Foundation

// MARK: - WorkoutEntry

struct WorkoutEntry: Codable, Identifiable, Equatable {
    var id: String
    var exercise: String
    var weight: Double
    var reps: Int
    var date: Date

    static func create(exercise: String, weight: Double, reps: Int, date: Date = Date()) -> WorkoutEntry {
        WorkoutEntry(id: UUID().uuidString, exercise: exercise, weight: weight, reps: reps, date: date)
    }
}

// MARK: - ExerciseGroup

struct ExerciseGroup: Identifiable {
    var id: String { exercise }
    var exercise: String
    var entries: [WorkoutEntry]

    var lastWeight: Double { entries.last?.weight ?? 0 }
    var lastReps: Int { entries.last?.reps ?? 0 }
    var lastDate: Date? { entries.last?.date }
    var totalVolume: Double { entries.reduce(0) { $0 + $1.weight * Double($1.reps) } }
}

// MARK: - HomeViewSettings

struct HomeViewSettings: Codable, Equatable {
    var showProgressionAlert: Bool = true
    var showStats: Bool = true
    var showCharts: Bool = true
    var showTopExercises: Bool = true
}

// MARK: - WorkoutStats

struct WorkoutStats {
    var totalWorkouts: Int
    var uniqueExercises: Int
    var totalVolumeKg: Double
    var mostFrequentExercise: String?
}

// MARK: - ProgressionAlert

struct ProgressionAlert: Identifiable {
    var id: String { exercise }
    var exercise: String
    var currentWeight: Double
    var suggestedWeight: Double
}

// MARK: - ChartDataPoint

struct ChartDataPoint: Identifiable {
    var id = UUID()
    var index: Int
    var value: Double
    var label: String
}
