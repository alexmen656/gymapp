import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var allEntries: [WorkoutEntry] = []
    @State private var deleteTarget: String?
    @State private var showDeleteAlert = false

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 12) {
                ScreenTitle(text: store.t("nav.history"))
                    .padding(.bottom, 4)

                if allEntries.isEmpty {
                    VStack(spacing: 12) {
                        Image(systemName: "calendar")
                            .font(.system(size: 64))
                            .foregroundColor(scheme == .dark ? Color(hex: "555555") : Color(hex: "cccccc"))
                            .padding(.top, 60)
                        Text(store.t("history.empty"))
                            .font(.system(size: 16))
                            .secondaryText()
                            .multilineTextAlignment(.center)
                    }
                    .frame(maxWidth: .infinity)
                } else {
                    ForEach(allEntries) { entry in
                        HistoryEntryCard(entry: entry, store: store, onDelete: {
                            deleteTarget = entry.id
                            showDeleteAlert = true
                        })
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 40)
            .padding(.bottom, 32)
        }
        .gymBackground()
        .navigationBarHidden(true)
        .onAppear(perform: reload)
        .alert(store.t("history.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let id = deleteTarget { store.deleteEntry(id: id); reload() }
            }
            Button(store.t("common.cancel"), role: .cancel) {}
        } message: {
            Text(store.t("history.delete.message"))
        }
    }

    private func reload() {
        store.reload()
        allEntries = store.entries.sorted { $0.date > $1.date }
    }
}

// MARK: - History Entry Card

struct HistoryEntryCard: View {
    let entry: WorkoutEntry
    let store: AppStore
    let onDelete: () -> Void
    @Environment(\.colorScheme) var scheme

    var body: some View {
        GlassCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.exercise)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                    Text("\(entry.weight, specifier: "%.1f") \(store.t("common.kg")) × \(entry.reps) \(store.t("common.reps"))")
                        .font(.system(size: 15))
                        .secondaryText()
                    Text(formatDate(entry.date))
                        .font(.system(size: 12))
                        .secondaryText()
                }
                Spacer()
                Button(action: onDelete) {
                    Image(systemName: "trash")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "FF3B30"))
                        .padding(8)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func formatDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.locale = Locale(identifier: store.language == "de" ? "de_DE" : "en_US")
        fmt.dateFormat = store.language == "de" ? "E, dd.MM.yyyy" : "E, MM/dd/yyyy"
        return fmt.string(from: date)
    }
}
