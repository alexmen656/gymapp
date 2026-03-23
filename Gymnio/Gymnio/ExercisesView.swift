import SwiftUI

struct ExercisesView: View {
    @EnvironmentObject var store: AppStore
    @State private var groups: [ExerciseGroup] = []
    @State private var deleteTarget: String? = nil
    @State private var showDeleteAlert = false

    var body: some View {
        NavigationStack {
            Group {
                if groups.isEmpty {
                    ContentUnavailableView(
                        store.t("exercises.title"),
                        systemImage: "dumbbell",
                        description: Text(store.t("exercises.empty"))
                    )
                } else {
                    List {
                        ForEach(groups) { group in
                            NavigationLink(destination: ExerciseDetailView(exerciseName: group.exercise)) {
                                ExerciseRow(group: group, store: store)
                            }
                            .listRowBackground(Color.clear)
                            .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                            .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                Button(role: .destructive) {
                                    deleteTarget = group.exercise
                                    showDeleteAlert = true
                                } label: {
                                    Label(store.t("common.delete"), systemImage: "trash")
                                }
                            }
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle(store.t("nav.exercises"))
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
    }

    private func reload() {
        store.reload()
        groups = store.groupedExercises()
    }
}

// MARK: - Exercise Row

struct ExerciseRow: View {
    let group: ExerciseGroup
    let store: AppStore

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(group.exercise)
                .font(.headline)

            if group.entries.isEmpty {
                Text(store.t("exercises.noEntries"))
                    .font(.caption)
                    .foregroundStyle(.secondary)
            } else {
                HStack(spacing: 16) {
                    Label(String(format: "%.1f kg", group.lastWeight), systemImage: "scalemass")
                        .font(.subheadline)
                    Label("\(group.lastReps) \(store.t("common.reps"))", systemImage: "repeat")
                        .font(.subheadline)
                    Spacer()
                    Label("\(group.entries.count)", systemImage: "list.number")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .foregroundStyle(.secondary)

                if let date = group.lastDate {
                    Text(date.formatted(date: .abbreviated, time: .omitted))
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
