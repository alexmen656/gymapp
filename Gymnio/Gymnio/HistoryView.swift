import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var store: AppStore
    @State private var allEntries: [WorkoutEntry] = []
    @State private var deleteTarget: String? = nil
    @State private var showDeleteAlert = false

    var body: some View {
        NavigationStack {
            Group {
                if allEntries.isEmpty {
                    ContentUnavailableView(
                        store.t("history.title"),
                        systemImage: "clock",
                        description: Text(store.t("history.empty"))
                    )
                } else {
                    List {
                        ForEach(allEntries) { entry in
                            HistoryEntryRow(entry: entry, store: store)
                                .listRowBackground(Color.clear)
                                .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                                .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                    Button(role: .destructive) {
                                        deleteTarget = entry.id
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
            .navigationTitle(store.t("nav.history"))
            .onAppear(perform: reload)
            .alert(store.t("history.delete.title"), isPresented: $showDeleteAlert) {
                Button(store.t("common.delete"), role: .destructive) {
                    if let id = deleteTarget {
                        store.deleteEntry(id: id)
                        reload()
                    }
                }
                Button(store.t("common.cancel"), role: .cancel) {}
            } message: {
                Text(store.t("history.delete.message"))
            }
        }
    }

    private func reload() {
        store.reload()
        allEntries = store.entries.sorted { $0.date > $1.date }
    }
}

// MARK: - History Entry Row

struct HistoryEntryRow: View {
    let entry: WorkoutEntry
    let store: AppStore

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(entry.exercise)
                    .font(.headline)
                HStack(spacing: 8) {
                    Label(String(format: "%.1f kg", entry.weight), systemImage: "scalemass")
                    Label("\(entry.reps) \(store.t("common.reps"))", systemImage: "repeat")
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)
            }
            Spacer()
            Text(entry.date.formatted(date: .abbreviated, time: .omitted))
                .font(.caption)
                .foregroundStyle(.tertiary)
        }
        .padding(.vertical, 4)
    }
}
