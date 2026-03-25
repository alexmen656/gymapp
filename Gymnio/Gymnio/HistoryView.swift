import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var allEntries: [WorkoutEntry] = []
    @State private var deleteTarget: String?
    @State private var showDeleteAlert = false

    var body: some View {
        ZStack {
            LinearGradient(colors: gymGradientColors(scheme), startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            if allEntries.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "calendar")
                        .font(.system(size: 64))
                        .foregroundColor(scheme == .dark ? Color(hex: "555555") : Color(hex: "cccccc"))
                    Text(store.t("history.empty"))
                        .font(.system(size: 16))
                        .secondaryText()
                        .multilineTextAlignment(.center)
                }
                .padding(.horizontal, 32)
            } else {
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 10) {
                        ScreenTitle(text: store.t("nav.history"))
                            .padding(.bottom, 4)

                        VStack(spacing: 10) {
                        ForEach(allEntries) { entry in
                            HistoryEntryCard(entry: entry, store: store) {
                                deleteTarget = entry.id
                                showDeleteAlert = true
                            }
                        }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 40)
                    .padding(.bottom, 32)
                }
            }
        }
        .navigationBarHidden(true)
        .onAppear(perform: reload)
        .alert(store.t("history.delete.title"), isPresented: $showDeleteAlert) {
            Button(store.t("common.delete"), role: .destructive) {
                if let id = deleteTarget { store.deleteEntry(id: id); reload() }
            }
            Button(store.t("common.cancel"), role: .cancel) {}
        } message: { Text(store.t("history.delete.message")) }
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
                        .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                    Text("\(entry.weight, specifier: "%.1f") \(store.t("common.kg")) × \(entry.reps) \(store.t("common.reps"))")
                        .font(.system(size: 15))
                        .secondaryText()
                    Text(fmt(entry.date))
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

    private func fmt(_ date: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: store.language == "de" ? "de_DE" : "en_US")
        f.dateFormat = store.language == "de" ? "E, dd.MM.yyyy" : "E, MM/dd/yyyy"
        return f.string(from: date)
    }
}
