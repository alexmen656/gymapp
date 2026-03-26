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

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return store.t("home.greeting.morning")
        case 12..<18: return store.t("home.greeting.afternoon")
        default:     return store.t("home.greeting.evening")
        }
    }

    var body: some View {
        NavigationStack(path: $navPath) {
            ZStack {
                LinearGradient(colors: gymGradientColors(scheme), startPoint: .top, endPoint: .bottom)
                    .ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 16) {

                        HStack {
                            Text(greeting)
                                .font(.system(size: 34, weight: .heavy))
                                .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                            Spacer()
                            GlassCircleButton(icon: "gearshape.fill") {
                                navPath.append(NavDest.settings)
                            }
                        }
                        .padding(.bottom, 4)

                        if store.entries.isEmpty {
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
                            VStack(spacing: 12) {

                            if store.homeSettings.showProgressionAlert, let alert = alerts.first {
                                ProgressionAlertCard(alert: alert)
                            }

                            if store.homeSettings.showStats {
                                HStack(spacing: 12) {
                                    HomeStatCard(value: "\(stats.totalWorkouts)",
                                                 label: store.t("home.stats.workouts"),
                                                 color: Color.tint(scheme))
                                    HomeStatCard(value: "\(Int(stats.totalVolumeKg / 1000))k",
                                                 label: store.t("home.stats.kg"),
                                                 color: .statRed)
                                    HomeStatCard(value: "\(stats.uniqueExercises)",
                                                 label: store.t("home.stats.exercises"),
                                                 color: .statTeal)
                                }
                            }

                            if store.homeSettings.showCharts && !topGroups.isEmpty && store.entries.count >= 5 {
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
                                }
                                .frame(height: 230)

                                PaginationDots(total: chartGroups.count, current: chartIndex)
                                    .frame(maxWidth: .infinity)
                            }

                            if store.homeSettings.showTopExercises && !topGroups.isEmpty {
                                GlassCard {
                                    VStack(alignment: .leading, spacing: 0) {
                                        Text(store.t("home.top.title"))
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                                            .padding(.bottom, 16)

                                        ForEach(Array(topGroups.prefix(3).enumerated()), id: \.element.id) { idx, group in
                                            HStack(spacing: 12) {
                                                Circle()
                                                    .fill(Color.tint(scheme).opacity(0.25))
                                                    .frame(width: 32, height: 32)
                                                    .overlay(
                                                        Text("\(idx + 1)")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(Color.tint(scheme))
                                                    )
                                                Text(group.exercise)
                                                    .font(.system(size: 15, weight: .semibold))
                                                    .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                                                    .frame(maxWidth: .infinity, alignment: .leading)
                                                Text(String(format: "%.0f kg", group.totalVolume))
                                                    .font(.system(size: 13, weight: .medium))
                                                    .secondaryText()
                                            }
                                            .padding(.bottom, idx < min(topGroups.count, 3) - 1 ? 12 : 0)
                                        }
                                    }
                                }
                            }

                            GlassCard {
                                Button {
                                    navPath.append(NavDest.customizeHome)
                                } label: {
                                    HStack(spacing: 10) {
                                        Image(systemName: "slider.horizontal.3")
                                            .foregroundColor(Color.tint(scheme))
                                        Text(store.t("home.customize"))
                                            .font(.system(size: 15, weight: .semibold))
                                            .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                                            .frame(maxWidth: .infinity, alignment: .leading)
                                        Image(systemName: "chevron.right")
                                            .font(.system(size: 13, weight: .semibold))
                                            .secondaryText()
                                    }
                                }
                                .buttonStyle(.plain)
                            }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 40)
                    .padding(.bottom, 32)
                }
            }
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

// MARK: - NavDest
enum NavDest: Hashable {
    case settings, customizeHome
}

// MARK: - Progression Alert Card

struct ProgressionAlertCard: View {
    let alert: ProgressionAlert
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    var body: some View {
        GlassCard(leftAccent: true) {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 12) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(Color.tint(scheme))
                    Text(store.t("home.progression.ready"))
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                }
                Text(String(format: store.t("home.progression.body"),
                            alert.exercise, alert.currentWeight, alert.suggestedWeight))
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
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    var data: [ChartDataPoint] { Analytics.weightChartData(entries: group.entries) }

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Text(group.exercise)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))

                if data.count >= 2 {
                    Chart(data) { pt in
                        LineMark(x: .value("i", pt.index), y: .value("kg", pt.value))
                            .interpolationMethod(.catmullRom)
                            .foregroundStyle(Color.tint(scheme))
                            .lineStyle(StrokeStyle(lineWidth: 5))
                        AreaMark(x: .value("i", pt.index), y: .value("kg", pt.value))
                            .interpolationMethod(.catmullRom)
                            .foregroundStyle(Color.tint(scheme).opacity(0.1))
                    }
                    .chartXAxis(.hidden)
                    .chartYAxis(.hidden)
                    .chartBackground { _ in Color.clear }
                    .frame(height: 120)
                }

                Text(store.t("home.charts.weight"))
                    .font(.system(size: 14))
                    .secondaryText()
                    .frame(maxWidth: .infinity, alignment: .center)
            }
        }
    }
}
