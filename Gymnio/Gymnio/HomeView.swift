import SwiftUI
import Charts

struct HomeView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var stats = WorkoutStats(totalWorkouts: 0, uniqueExercises: 0, totalVolumeKg: 0)
    @State private var alerts: [ProgressionAlert] = []
    @State private var topGroups: [ExerciseGroup] = []
    @State private var chartIndex: Int = 0
    @State private var navPath = NavigationPath()

    var body: some View {
        NavigationStack(path: $navPath) {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 16) {
                    // Header
                    HStack {
                        Text(store.t("home.greeting.morning"))
                            .font(.system(size: 34, weight: .heavy))
                            .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                        Spacer()
                        HStack(spacing: 8) {
                            GlassCircleButton(icon: "slider.horizontal.3") {
                                navPath.append(NavDest.customizeHome)
                            }
                            GlassCircleButton(icon: "gearshape.fill") {
                                navPath.append(NavDest.settings)
                            }
                        }
                    }
                    .padding(.bottom, 4)

                    if store.entries.isEmpty {
                        // Empty state
                        VStack(spacing: 12) {
                            Image(systemName: "chart.line.uptrend.xyaxis")
                                .font(.system(size: 64))
                                .foregroundColor(scheme == .dark ? Color(hex: "555555") : Color(hex: "cccccc"))
                                .padding(.top, 60)
                            Text(store.t("home.empty"))
                                .font(.system(size: 18, weight: .semibold))
                                .secondaryText()
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                    } else {
                        // Progression Alert
                        if store.homeSettings.showProgressionAlert, let alert = alerts.first {
                            ProgressionAlertCard(alert: alert)
                        }

                        // Stats
                        if store.homeSettings.showStats {
                            HStack(spacing: 12) {
                                HomeStatCard(value: "\(stats.totalWorkouts)",
                                             label: store.t("home.stats.workouts"),
                                             color: .statBlue)
                                HomeStatCard(value: "\(Int(stats.totalVolumeKg / 1000))k",
                                             label: store.t("home.stats.kg"),
                                             color: .statRed)
                                HomeStatCard(value: "\(stats.uniqueExercises)",
                                             label: store.t("home.stats.exercises"),
                                             color: .statTeal)
                            }
                        }

                        // Charts (paging)
                        if store.homeSettings.showCharts && topGroups.count > 0 && store.entries.count >= 5 {
                            let chartGroups = Array(topGroups.prefix(3))
                            GeometryReader { geo in
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 0) {
                                        ForEach(chartGroups) { group in
                                            HomeChartCard(group: group)
                                                .frame(width: geo.size.width)
                                        }
                                    }
                                }
                                .scrollTargetBehavior(.paging)
                                .scrollPosition(id: Binding(
                                    get: { chartGroups.indices.contains(chartIndex) ? chartGroups[chartIndex].id : nil },
                                    set: { newID in
                                        if let id = newID, let idx = chartGroups.firstIndex(where: { $0.id == id }) {
                                            chartIndex = idx
                                        }
                                    }
                                ))
                            }
                            .frame(height: 230)

                            PaginationDots(total: min(topGroups.count, 3), current: chartIndex)
                                .frame(maxWidth: .infinity)
                        }

                        // Top Exercises
                        if store.homeSettings.showTopExercises && !topGroups.isEmpty {
                            GlassCard {
                                VStack(alignment: .leading, spacing: 0) {
                                    Text(store.t("home.top.title"))
                                        .font(.system(size: 18, weight: .bold))
                                        .padding(.bottom, 16)

                                    ForEach(Array(topGroups.prefix(3).enumerated()), id: \.element.id) { idx, group in
                                        HStack(spacing: 12) {
                                            Circle()
                                                .fill(Color.statBlue.opacity(0.25))
                                                .frame(width: 32, height: 32)
                                                .overlay(
                                                    Text("\(idx + 1)")
                                                        .font(.system(size: 14, weight: .bold))
                                                        .foregroundColor(.statBlue)
                                                )
                                            Text(group.exercise)
                                                .font(.system(size: 15, weight: .semibold))
                                            Spacer()
                                            Text(String(format: "%.0f kg", group.totalVolume))
                                                .font(.system(size: 13, weight: .medium))
                                                .secondaryText()
                                        }
                                        .padding(.bottom, idx < min(topGroups.count, 3) - 1 ? 12 : 0)
                                    }
                                }
                            }
                        }

                        // Customize Dashboard button
                        GlassCard {
                            Button {
                                navPath.append(NavDest.customizeHome)
                            } label: {
                                HStack(spacing: 10) {
                                    Image(systemName: "slider.horizontal.3")
                                        .foregroundColor(.statBlue)
                                    Text(store.t("home.customize"))
                                        .font(.system(size: 15, weight: .semibold))
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    Image(systemName: "chevron.right")
                                        .font(.caption)
                                        .secondaryText()
                                }
                                .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 40)
                .padding(.bottom, 32)
            }
            .gymBackground()
            .navigationBarHidden(true)
            .navigationDestination(for: NavDest.self) { dest in
                switch dest {
                case .settings:      SettingsView()
                case .customizeHome: CustomizeHomeView()
                }
            }
        }
        .onAppear(perform: reload)
    }

    private func reload() {
        store.reload()
        let groups = store.groupedExercises()
        stats = Analytics.workoutStats(entries: store.entries)
        alerts = Analytics.progressionAlerts(groups: groups)
        topGroups = Analytics.topExercisesByVolume(groups: groups)
    }
}

// MARK: - Nav Destination

enum NavDest: Hashable {
    case settings
    case customizeHome
}

// MARK: - Progression Alert Card

struct ProgressionAlertCard: View {
    let alert: ProgressionAlert
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard(leftAccent: true) {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 12) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(.statBlue)
                    Text("Bereit für mehr?")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                }
                Text("**\(alert.exercise)**: 5× bei \(alert.currentWeight, specifier: "%.1f") kg → Versuche \(alert.suggestedWeight, specifier: "%.1f") kg! 💪")
                    .font(.system(size: 14))
                    .secondaryText()
                    .lineSpacing(3)
            }
        }
    }
}

// MARK: - Home Stat Card

struct HomeStatCard: View {
    let value: String
    let label: String
    let color: Color
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard {
            VStack(spacing: 2) {
                Text(value)
                    .font(.system(size: 30, weight: .heavy))
                    .foregroundColor(color)
                    .minimumScaleFactor(0.5)
                    .lineLimit(1)
                Text(label)
                    .font(.system(size: 12))
                    .secondaryText()
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 4)
        }
    }
}

// MARK: - Home Chart Card

struct HomeChartCard: View {
    let group: ExerciseGroup
    @Environment(\.colorScheme) var scheme

    var data: [ChartDataPoint] { Analytics.weightChartData(entries: group.entries) }

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Text("Trend: \(group.exercise)")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                if data.count >= 2 {
                    Chart(data) { point in
                        LineMark(
                            x: .value("i", point.index),
                            y: .value("kg", point.value)
                        )
                        .interpolationMethod(.catmullRom)
                        .foregroundStyle(Color.statBlue)
                        .lineStyle(StrokeStyle(lineWidth: 5))
                        AreaMark(
                            x: .value("i", point.index),
                            y: .value("kg", point.value)
                        )
                        .interpolationMethod(.catmullRom)
                        .foregroundStyle(Color.statBlue.opacity(0.12))
                    }
                    .chartXAxis(.hidden)
                    .chartYAxis(.hidden)
                    .frame(height: 120)
                }

                Text("Kilogramm")
                    .font(.system(size: 14))
                    .secondaryText()
                    .frame(maxWidth: .infinity, alignment: .center)
            }
        }
        .padding(.horizontal, 0)
    }
}
