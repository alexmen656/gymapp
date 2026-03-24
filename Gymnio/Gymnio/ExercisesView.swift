import SwiftUI

struct ExercisesView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var groups: [ExerciseGroup] = []
    @State private var deleteTarget: String?
    @State private var showDeleteAlert = false

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 12) {
                ScreenTitle(text: store.t("nav.exercises"))
                    .padding(.bottom, 4)

                if groups.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "plus.circle")
                            .font(.system(size: 64))
                            .foregroundColor(scheme == .dark ? Color(hex: "555555") : Color(hex: "cccccc"))
                            .padding(.top, 60)
                        Text(store.t("exercises.empty"))
                            .font(.system(size: 16))
                            .secondaryText()
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                } else {
                    ForEach(groups) { group in
                        NavigationLink(destination: ExerciseDetailView(exerciseName: group.exercise)) {
                            ExerciseCard(group: group, store: store)
                        }
                        .buttonStyle(.plain)
                        .simultaneousGesture(
                            LongPressGesture().onEnded { _ in
                                deleteTarget = group.exercise
                                showDeleteAlert = true
                            }
                        )
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 40)
            .padding(.bottom, 120)
        }
        .gymBackground()
        .navigationBarHidden(true)
        .onAppear(perform: reload)
        .alert(store.t("exercises.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let name = deleteTarget { store.deleteExercise(name) }
                reload()
            }
            Button(store.t("common.cancel"), role: .cancel) {}
        } message: {
            Text(String(format: store.t("exercises.delete.message"), deleteTarget ?? ""))
        }
    }

    private func reload() {
        store.reload()
        groups = store.groupedExercises()
    }
}

// MARK: - Exercise Card

struct ExerciseCard: View {
    let group: ExerciseGroup
    let store: AppStore
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Text(group.exercise)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                if group.entries.isEmpty {
                    Text(store.t("exercises.noEntries"))
                        .font(.system(size: 13))
                        .italic()
                        .secondaryText()
                } else {
                    HStack(spacing: 0) {
                        ExerciseStat(value: String(format: "%.1f", group.lastWeight),
                                     label: store.t("common.kg"))
                        ExerciseStat(value: "\(group.lastReps)",
                                     label: store.t("common.reps"))
                        ExerciseStat(value: "\(group.entries.count)",
                                     label: store.t("exercises.entries"))
                    }

                    if let date = group.lastDate {
                        Text(store.t("exercises.lastDate") + ": " + formatDate(date))
                            .font(.system(size: 12))
                            .secondaryText()
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                }
            }
        }
    }

    private func formatDate(_ date: Date) -> String {
        let lang = store.language
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: lang == "de" ? "de_DE" : "en_US")
        fmt.dateStyle = .short
        return fmt.string(from: date)
    }
}

struct ExerciseStat: View {
    let value: String
    let label: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
            Text(label)
                .font(.system(size: 12))
                .secondaryText()
        }
        .frame(maxWidth: .infinity)
    }
}
