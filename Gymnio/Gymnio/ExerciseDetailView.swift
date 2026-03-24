import SwiftUI
import Charts

struct ExerciseDetailView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    let exerciseName: String

    @State private var entries: [WorkoutEntry] = []
    @State private var weightText = ""
    @State private var repsText = ""
    @State private var selectedDate = Date()
    @State private var showDatePicker = false
    @State private var chartIndex = 0
    @State private var deleteTarget: String?
    @State private var showDeleteAlert = false
    @FocusState private var focusedField: Field?

    enum Field { case weight, reps }

    private var weightValue: Double? { Double(weightText.replacingOccurrences(of: ",", with: ".")) }
    private var repsValue: Int? { Int(repsText) }
    private var isFilled: Bool { weightValue != nil && repsValue != nil }
    private var maxWeight: Double { entries.map { $0.weight }.max() ?? 0 }
    private var maxReps: Int { entries.map { $0.reps }.max() ?? 0 }
    private var showCharts: Bool { entries.count >= 5 }

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 16) {
                // Large title in content (matching original)
                Text(exerciseName)
                    .font(.system(size: 34, weight: .heavy))
                    .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                    .padding(.top, -16)
                    .padding(.bottom, 8)

                // Add Entry Form
                GlassCard {
                    VStack(alignment: .leading, spacing: 14) {
                        Text(store.t("detail.add"))
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                        // Inputs
                        HStack(spacing: 12) {
                            DetailInputField(
                                label: store.t("detail.weight") ,
                                placeholder: "0",
                                text: $weightText,
                                keyboardType: .decimalPad,
                                focused: $focusedField,
                                field: .weight
                            )
                            DetailInputField(
                                label: store.t("detail.reps"),
                                placeholder: "0",
                                text: $repsText,
                                keyboardType: .numberPad,
                                focused: $focusedField,
                                field: .reps
                            )
                        }

                        // Date picker row
                        Button {
                            showDatePicker.toggle()
                            focusedField = nil
                        } label: {
                            HStack(spacing: 8) {
                                Image(systemName: "calendar")
                                    .foregroundColor(scheme == .dark ? Color(hex: "98989f") : Color(hex: "666666"))
                                Text(formatShortDate(selectedDate))
                                    .font(.system(size: 14))
                                    .secondaryText()
                            }
                        }

                        if showDatePicker {
                            DatePicker("", selection: $selectedDate,
                                       in: ...Date(),
                                       displayedComponents: .date)
                                .datePickerStyle(.wheel)
                                .labelsHidden()
                                .frame(maxWidth: .infinity)
                            Button(store.language == "de" ? "Fertig" : "Done") {
                                showDatePicker = false
                            }
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.statBlue)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                        }

                        // Add Button
                        AccentButton(label: store.t("detail.add"), disabled: !isFilled) {
                            addEntry()
                        }
                    }
                }

                // Summary Card
                if !entries.isEmpty {
                    GlassCard {
                        HStack(spacing: 0) {
                            SummaryItem(value: "\(entries.count)", label: store.t("detail.stats.total"))
                            SummaryItem(value: "\(maxWeight) kg", label: store.language == "de" ? "Max Gewicht" : "Max Weight")
                            SummaryItem(value: "\(maxReps)", label: store.language == "de" ? "Max Wdh" : "Max Reps")
                        }
                    }
                }

                // Charts (only when >= 5 entries)
                if showCharts {
                    let charts: [(String, String, [ChartDataPoint])] = [
                        (store.t("detail.chart.weight"), store.t("common.kg"), Analytics.weightChartData(entries: entries)),
                        (store.t("detail.chart.reps"), store.language == "de" ? "Anzahl" : "Count", Analytics.repsChartData(entries: entries)),
                        (store.t("detail.chart.volume"), "\(store.t("common.kg")) × \(store.t("common.reps"))", Analytics.volumeChartData(entries: entries))
                    ]

                    GeometryReader { geo in
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 0) {
                                ForEach(Array(charts.enumerated()), id: \.offset) { idx, chart in
                                    DetailChartCard(title: chart.0, unit: chart.1, data: chart.2)
                                        .frame(width: geo.size.width)
                                }
                            }
                        }
                        .scrollTargetBehavior(.paging)
                    }
                    .frame(height: 220)

                    PaginationDots(total: 3, current: chartIndex)
                        .frame(maxWidth: .infinity)
                }

                // History List
                if !entries.isEmpty {
                    Text(store.t("detail.history.title"))
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                    ForEach(entries) { entry in
                        EntryCard(
                            entry: entry,
                            isPB: entry.weight == maxWeight,
                            language: store.language,
                            onDelete: {
                                deleteTarget = entry.id
                                showDeleteAlert = true
                            }
                        )
                    }
                } else {
                    Text(store.t("detail.history.empty"))
                        .font(.system(size: 15))
                        .secondaryText()
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.top, 40)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .gymBackground()
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle("")
        .onTapGesture { focusedField = nil }
        .onAppear(perform: reload)
        .alert(store.t("detail.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let id = deleteTarget { store.deleteEntry(id: id); reload() }
            }
            Button(store.t("common.cancel"), role: .cancel) {}
        } message: { Text(store.t("detail.delete.message")) }
    }

    private func reload() {
        entries = store.entriesForExercise(exerciseName)
    }

    private func addEntry() {
        guard let w = weightValue, let r = repsValue, w > 0, r > 0 else { return }
        store.addEntry(exercise: exerciseName, weight: w, reps: r, date: selectedDate)
        weightText = ""
        repsText = ""
        selectedDate = Date()
        focusedField = nil
        showDatePicker = false
        reload()
    }

    private func formatShortDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: store.language == "de" ? "de_DE" : "en_US")
        fmt.dateStyle = .short
        return fmt.string(from: date)
    }
}

// MARK: - Input Field

struct DetailInputField: View {
    let label: String
    let placeholder: String
    @Binding var text: String
    let keyboardType: UIKeyboardType
    var focused: FocusState<ExerciseDetailView.Field?>.Binding
    let field: ExerciseDetailView.Field
    @Environment(\.colorScheme) var scheme

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 12, weight: .semibold))
                .secondaryText()
            TextField(placeholder, text: $text)
                .keyboardType(keyboardType)
                .focused(focused, equals: field)
                .font(.system(size: 20, weight: .semibold))
                .multilineTextAlignment(.center)
                .padding(14)
                .background(scheme == .dark
                    ? Color.white.opacity(0.08)
                    : Color.black.opacity(0.04))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(scheme == .dark
                                ? Color.white.opacity(0.12)
                                : Color.black.opacity(0.1),
                                lineWidth: 0.5)
                )
                .cornerRadius(12)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Summary Item

struct SummaryItem: View {
    let value: String
    let label: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
            Text(label)
                .font(.system(size: 12))
                .secondaryText()
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Detail Chart Card

struct DetailChartCard: View {
    let title: String
    let unit: String
    let data: [ChartDataPoint]
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                if data.count >= 2 {
                    Chart(data) { point in
                        LineMark(
                            x: .value("i", point.index),
                            y: .value("v", point.value)
                        )
                        .interpolationMethod(.catmullRom)
                        .foregroundStyle(Color.statBlue)
                        .lineStyle(StrokeStyle(lineWidth: 5))
                        AreaMark(
                            x: .value("i", point.index),
                            y: .value("v", point.value)
                        )
                        .interpolationMethod(.catmullRom)
                        .foregroundStyle(Color.statBlue.opacity(0.12))
                    }
                    .chartXAxis(.hidden)
                    .chartYAxis(.hidden)
                    .frame(height: 120)
                }

                Text(unit)
                    .font(.system(size: 14))
                    .secondaryText()
                    .frame(maxWidth: .infinity, alignment: .center)
            }
        }
    }
}

// MARK: - Entry Card

struct EntryCard: View {
    let entry: WorkoutEntry
    let isPB: Bool
    let language: String
    let onDelete: () -> Void
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 4) {
                        Text(String(format: "%.1f kg", entry.weight))
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                        Text("× \(entry.reps) Wdh")
                            .font(.system(size: 15))
                            .secondaryText()
                        if isPB {
                            RoundedRectangle(cornerRadius: 6)
                                .fill(scheme == .dark
                                      ? Color(hex: "fbbf24").opacity(0.2)
                                      : Color(hex: "fef3c7"))
                                .frame(width: 26, height: 22)
                                .overlay(
                                    Image(systemName: "trophy.fill")
                                        .font(.system(size: 12))
                                        .foregroundColor(scheme == .dark ? Color(hex: "fbbf24") : Color(hex: "92400e"))
                                )
                        }
                    }
                    Text(formatDate(entry.date))
                        .font(.system(size: 12))
                        .secondaryText()
                }
                Spacer()
                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "FF3B30"))
                        .padding(8)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func formatDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: language == "de" ? "de_DE" : "en_US")
        fmt.dateFormat = language == "de" ? "E, dd.MM.yyyy" : "E, MM/dd/yyyy"
        return fmt.string(from: date)
    }
}
