import SwiftUI
import Charts

struct HomeView: View {
    @EnvironmentObject var store: AppStore
    @Binding var showSettings: Bool
    @Binding var showCustomizeHome: Bool

    @State private var stats = WorkoutStats(totalWorkouts: 0, uniqueExercises: 0, totalVolumeKg: 0, mostFrequentExercise: nil)
    @State private var alerts: [ProgressionAlert] = []
    @State private var topGroups: [ExerciseGroup] = []
    @State private var groups: [ExerciseGroup] = []

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {

                    // Greeting
                    Text(greeting)
                        .font(.largeTitle.bold())
                        .padding(.horizontal)

                    // Progression Alert
                    if store.homeSettings.showProgressionAlert, let alert = alerts.first {
                        ProgressionAlertCard(alert: alert, store: store)
                            .padding(.horizontal)
                    }

                    // Stats
                    if store.homeSettings.showStats {
                        StatsRow(stats: stats, store: store)
                            .padding(.horizontal)
                    }

                    // Charts for top exercises
                    if store.homeSettings.showCharts && !topGroups.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            SectionHeader(title: store.t("home.charts.title"))
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 12) {
                                    ForEach(topGroups.prefix(3)) { group in
                                        HomeChartCard(group: group)
                                            .frame(width: 260)
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                    }

                    // Top exercises
                    if store.homeSettings.showTopExercises && !topGroups.isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            SectionHeader(title: store.t("home.top.title"))
                                .padding(.horizontal)
                            ForEach(Array(topGroups.prefix(5).enumerated()), id: \.element.id) { idx, group in
                                TopExerciseRow(rank: idx + 1, group: group, store: store)
                                    .padding(.horizontal)
                            }
                        }
                    }

                    // Empty state
                    if store.entries.isEmpty {
                        Text(store.t("home.empty"))
                            .foregroundStyle(.secondary)
                            .frame(maxWidth: .infinity)
                            .padding()
                    }

                    Spacer(minLength: 100)
                }
                .padding(.top)
            }
            .navigationTitle("Gymnio")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack {
                        Button {
                            showCustomizeHome = true
                        } label: {
                            Image(systemName: "slider.horizontal.3")
                        }
                        Button {
                            showSettings = true
                        } label: {
                            Image(systemName: "gearshape.fill")
                        }
                    }
                }
            }
            .onAppear(perform: reload)
        }
    }

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return store.t("home.greeting.morning")
        case 12..<17: return store.t("home.greeting.afternoon")
        default: return store.t("home.greeting.evening")
        }
    }

    private func reload() {
        store.reload()
        groups = store.groupedExercises()
        stats = Analytics.workoutStats(entries: store.entries)
        alerts = Analytics.progressionAlerts(groups: groups)
        topGroups = Analytics.topExercisesByVolume(groups: groups)
    }
}

// MARK: - Sub-views

struct ProgressionAlertCard: View {
    let alert: ProgressionAlert
    let store: AppStore

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Image(systemName: "arrow.up.circle.fill")
                    .foregroundColor(.green)
                Text(store.t("home.progression.title"))
                    .font(.headline)
            }
            Text("\(alert.exercise): \(alert.currentWeight, specifier: "%.1f") kg → \(alert.suggestedWeight, specifier: "%.1f") kg")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(14)
    }
}

struct StatsRow: View {
    let stats: WorkoutStats
    let store: AppStore

    var body: some View {
        HStack(spacing: 12) {
            StatCard(value: "\(stats.totalWorkouts)", label: store.t("home.stats.workouts"), icon: "figure.walk")
            StatCard(value: String(format: "%.0f", stats.totalVolumeKg), label: store.t("home.stats.kg"), icon: "scalemass.fill")
            StatCard(value: "\(stats.uniqueExercises)", label: store.t("home.stats.exercises"), icon: "list.bullet")
        }
    }
}

struct StatCard: View {
    let value: String
    let label: String
    let icon: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(.accentColor)
            Text(value)
                .font(.title2.bold())
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(.thinMaterial)
        .cornerRadius(14)
    }
}

struct HomeChartCard: View {
    let group: ExerciseGroup

    var body: some View {
        let data = Analytics.weightChartData(entries: group.entries)
        VStack(alignment: .leading, spacing: 8) {
            Text(group.exercise)
                .font(.headline)
                .lineLimit(1)
            if data.count >= 2 {
                Chart(data) { point in
                    LineMark(
                        x: .value("Index", point.index),
                        y: .value("Gewicht", point.value)
                    )
                    .foregroundStyle(Color.accentColor)
                    AreaMark(
                        x: .value("Index", point.index),
                        y: .value("Gewicht", point.value)
                    )
                    .foregroundStyle(Color.accentColor.opacity(0.15))
                }
                .chartXAxis(.hidden)
                .chartYAxis {
                    AxisMarks(position: .leading, values: .automatic(desiredCount: 3)) {
                        AxisValueLabel()
                            .font(.caption2)
                    }
                }
                .frame(height: 100)
            } else {
                Text("–")
                    .foregroundStyle(.secondary)
                    .frame(height: 100)
            }
            Text(String(format: "%.1f kg", group.lastWeight))
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(14)
    }
}

struct TopExerciseRow: View {
    let rank: Int
    let group: ExerciseGroup
    let store: AppStore

    var body: some View {
        HStack {
            Text("\(rank)")
                .font(.headline.monospacedDigit())
                .foregroundColor(.accentColor)
                .frame(width: 24)
            VStack(alignment: .leading, spacing: 2) {
                Text(group.exercise)
                    .font(.headline)
                Text(String(format: store.t("home.top.volume"), group.totalVolume))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text(String(format: "%.1f kg", group.lastWeight))
                .font(.subheadline.monospacedDigit())
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(12)
    }
}

struct SectionHeader: View {
    let title: String
    var body: some View {
        Text(title)
            .font(.title3.bold())
            .padding(.horizontal)
    }
}
