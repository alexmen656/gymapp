import SwiftUI

struct CustomizeHomeView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @State private var settings = HomeViewSettings()

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Toggle(store.t("customize.progression"), isOn: $settings.showProgressionAlert)
                    Toggle(store.t("customize.stats"), isOn: $settings.showStats)
                    Toggle(store.t("customize.charts"), isOn: $settings.showCharts)
                    Toggle(store.t("customize.top"), isOn: $settings.showTopExercises)
                }

                Section {
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "info.circle.fill")
                            .foregroundColor(.accentColor)
                        Text(store.t("customize.info"))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }

                Section {
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "lightbulb.fill")
                            .foregroundColor(.yellow)
                        Text(store.t("customize.tip"))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle(store.t("customize.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button(store.t("common.cancel")) { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(store.t("common.save")) {
                        store.saveHomeSettings(settings)
                        dismiss()
                    }
                    .bold()
                }
            }
            .onAppear {
                settings = store.homeSettings
            }
        }
    }
}
