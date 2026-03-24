import SwiftUI

struct ExercisesView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var groups: [ExerciseGroup] = []
    @State private var deleteTarget: String?
    @State private var showDeleteAlert = false

    var body: some View {
        ZStack {
            LinearGradient(colors: gymGradientColors(scheme), startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            if groups.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "plus.circle")
                        .font(.system(size: 64))
                        .foregroundColor(scheme == .dark ? Color(hex: "555555") : Color(hex: "cccccc"))
                    Text(store.t("exercises.empty"))
                        .font(.system(size: 16))
                        .secondaryText()
                        .multilineTextAlignment(.center)
                }
                .padding(.horizontal, 32)
            } else {
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 12) {
                        ScreenTitle(text: store.t("nav.exercises"))
                            .padding(.bottom, 4)

                        GlassEffectContainer(spacing: 12) {
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
            }
        }
        .navigationBarHidden(true)
        .onAppear(perform: reload)
        .alert(store.t("exercises.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let n = deleteTarget { store.deleteExercise(n) }
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
                    .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))

                if group.entries.isEmpty {
                    Text(store.t("exercises.noEntries"))
                        .font(.system(size: 13))
                        .italic()
                        .secondaryText()
                } else {
                    HStack(spacing: 0) {
                        ExerciseStat(value: String(format: "%.1f", group.lastWeight), label: store.t("common.kg"))
                        ExerciseStat(value: "\(group.lastReps)", label: store.t("common.reps"))
                        ExerciseStat(value: "\(group.entries.count)", label: store.t("exercises.entries"))
                    }
                    if let date = group.lastDate {
                        Text(store.t("exercises.lastDate") + ": " + fmt(date))
                            .font(.system(size: 12))
                            .secondaryText()
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                }
            }
        }
    }

    private func fmt(_ date: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: store.language == "de" ? "de_DE" : "en_US")
        f.dateStyle = .short
        return f.string(from: date)
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
                .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
            Text(label)
                .font(.system(size: 12))
                .secondaryText()
        }
        .frame(maxWidth: .infinity)
    }
}
