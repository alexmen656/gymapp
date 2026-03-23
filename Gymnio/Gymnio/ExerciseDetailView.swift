import SwiftUI
import Charts

struct ExerciseDetailView: View {
    @EnvironmentObject var store: AppStore
    let exerciseName: String

    @State private var entries: [WorkoutEntry] = []
    @State private var weightText = ""
    @State private var repsText = ""
    @State private var selectedDate = Date()
    @State private var showDatePicker = false
    @State private var deleteTarget: String? = nil
    @State private var showDeleteAlert = false
    @FocusState private var focusedField: Field?

    enum Field { case weight, reps }

    private var canAdd: Bool { weightValue != nil && repsValue != nil }
    private var weightValue: Double? { Double(weightText.replacingOccurrences(of: ",", with: ".")) }
    private var repsValue: Int? { Int(repsText) }

    private var maxWeight: Double { entries.map { $0.weight }.max() ?? 0 }
    private var maxReps: Int { entries.map { $0.reps }.max() ?? 0 }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // Form
                FormCard(
                    weightText: $weightText,
                    repsText: $repsText,
                    selectedDate: $selectedDate,
                    showDatePicker: $showDatePicker,
                    focusedField: $focusedField,
                    canAdd: canAdd,
                    store: store,
                    onAdd: addEntry
                )
                .padding(.horizontal)

                // Stats
                if !entries.isEmpty {
                    HStack(spacing: 12) {
                        StatMini(value: "\(entries.count)", label: store.t("detail.stats.total"), icon: "number")
                        StatMini(value: String(format: "%.1f kg", maxWeight), label: store.t("detail.stats.maxWeight"), icon: "scalemass.fill")
                        StatMini(value: "\(maxReps)", label: store.t("detail.stats.maxReps"), icon: "repeat")
                    }
                    .padding(.horizontal)
                }

                // Charts
                if entries.count >= 2 {
                    VStack(spacing: 0) {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                TrendChart(
                                    data: Analytics.weightChartData(entries: entries),
                                    title: store.t("detail.chart.weight"),
                                    unit: "kg",
                                    color: .accentColor
                                )
                                .frame(width: 260)
                                TrendChart(
                                    data: Analytics.repsChartData(entries: entries),
                                    title: store.t("detail.chart.reps"),
                                    unit: store.t("common.reps"),
                                    color: .green
                                )
                                .frame(width: 260)
                                TrendChart(
                                    data: Analytics.volumeChartData(entries: entries),
                                    title: store.t("detail.chart.volume"),
                                    unit: "kg",
                                    color: .orange
                                )
                                .frame(width: 260)
                            }
                            .padding(.horizontal)
                        }
                    }
                }

                // History
                if !entries.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(store.t("detail.history.title"))
                            .font(.title3.bold())
                            .padding(.horizontal)

                        ForEach(entries.reversed()) { entry in
                            EntryRow(
                                entry: entry,
                                isPB: entry.weight == maxWeight,
                                store: store,
                                onDelete: {
                                    deleteTarget = entry.id
                                    showDeleteAlert = true
                                }
                            )
                            .padding(.horizontal)
                        }
                    }
                } else {
                    Text(store.t("detail.history.empty"))
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                }

                Spacer(minLength: 40)
            }
            .padding(.top)
        }
        .navigationTitle(exerciseName)
        .navigationBarTitleDisplayMode(.large)
        .onAppear(perform: reload)
        .onTapGesture { focusedField = nil }
        .alert(store.t("detail.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let id = deleteTarget {
                    store.deleteEntry(id: id)
                    reload()
                }
            }
            Button(store.t("common.cancel"), role: .cancel) {}
        } message: {
            Text(store.t("detail.delete.message"))
        }
    }

    private func reload() {
        entries = store.entriesForExercise(exerciseName)
    }

    private func addEntry() {
        guard let w = weightValue, let r = repsValue else { return }
        store.addEntry(exercise: exerciseName, weight: w, reps: r, date: selectedDate)
        weightText = ""
        repsText = ""
        selectedDate = Date()
        focusedField = nil
        reload()
    }
}

// MARK: - Form Card

struct FormCard: View {
    @Binding var weightText: String
    @Binding var repsText: String
    @Binding var selectedDate: Date
    @Binding var showDatePicker: Bool
    var focusedField: FocusState<ExerciseDetailView.Field?>.Binding
    let canAdd: Bool
    let store: AppStore
    let onAdd: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(store.t("detail.weight"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    TextField("0.0", text: $weightText)
                        .keyboardType(.decimalPad)
                        .focused(focusedField, equals: .weight)
                        .textFieldStyle(.roundedBorder)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text(store.t("detail.reps"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    TextField("0", text: $repsText)
                        .keyboardType(.numberPad)
                        .focused(focusedField, equals: .reps)
                        .textFieldStyle(.roundedBorder)
                }
            }

            Button {
                showDatePicker.toggle()
            } label: {
                HStack {
                    Image(systemName: "calendar")
                    Text(selectedDate.formatted(date: .abbreviated, time: .omitted))
                    Spacer()
                    Image(systemName: "chevron.down")
                        .rotationEffect(.degrees(showDatePicker ? 180 : 0))
                }
                .padding(10)
                .background(Color(.systemGray6))
                .cornerRadius(8)
            }
            .buttonStyle(.plain)

            if showDatePicker {
                DatePicker("", selection: $selectedDate, displayedComponents: .date)
                    .datePickerStyle(.graphical)
            }

            Button(action: onAdd) {
                Text(store.t("detail.add"))
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .disabled(!canAdd)
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(16)
    }
}

// MARK: - Trend Chart

struct TrendChart: View {
    let data: [ChartDataPoint]
    let title: String
    let unit: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            Chart(data) { point in
                LineMark(
                    x: .value("i", point.index),
                    y: .value(title, point.value)
                )
                .foregroundStyle(color)
                AreaMark(
                    x: .value("i", point.index),
                    y: .value(title, point.value)
                )
                .foregroundStyle(color.opacity(0.15))
                PointMark(
                    x: .value("i", point.index),
                    y: .value(title, point.value)
                )
                .foregroundStyle(color)
                .symbolSize(40)
            }
            .chartXAxis {
                AxisMarks(values: data.map { $0.index }) { value in
                    if let idx = value.as(Int.self), let point = data.first(where: { $0.index == idx }) {
                        AxisValueLabel { Text(point.label).font(.caption2) }
                    }
                }
            }
            .chartYAxis {
                AxisMarks(position: .leading, values: .automatic(desiredCount: 3)) {
                    AxisValueLabel().font(.caption2)
                }
            }
            .frame(height: 120)

            if let last = data.last {
                Text(String(format: "%.1f \(unit)", last.value))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(14)
    }
}

// MARK: - Entry Row

struct EntryRow: View {
    let entry: WorkoutEntry
    let isPB: Bool
    let store: AppStore
    let onDelete: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text(String(format: "%.1f kg", entry.weight))
                        .font(.headline)
                    Text("× \(entry.reps)")
                        .font(.headline)
                        .foregroundStyle(.secondary)
                    if isPB {
                        Label(store.t("detail.pb"), systemImage: "trophy.fill")
                            .font(.caption)
                            .foregroundColor(.yellow)
                    }
                }
                Text(entry.date.formatted(date: .abbreviated, time: .omitted))
                    .font(.caption)
                    .foregroundStyle(.tertiary)
            }
            Spacer()
            Button(role: .destructive, action: onDelete) {
                Image(systemName: "trash")
                    .foregroundColor(.red)
            }
            .buttonStyle(.plain)
        }
        .padding()
        .background(.thinMaterial)
        .cornerRadius(12)
    }
}

// MARK: - Stat Mini

struct StatMini: View {
    let value: String
    let label: String
    let icon: String

    var body: some View {
        VStack(spacing: 4) {
            Image(systemName: icon)
                .foregroundColor(.accentColor)
            Text(value)
                .font(.subheadline.bold())
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(.thinMaterial)
        .cornerRadius(12)
    }
}
