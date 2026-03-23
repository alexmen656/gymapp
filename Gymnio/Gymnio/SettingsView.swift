import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @State private var notificationsEnabled = false
    @State private var showLanguagePicker = false
    @State private var showThemePicker = false

    // Daily reminder stored separately
    private let notifKey = "daily_reminder_enabled"

    var body: some View {
        NavigationStack {
            Form {
                // MARK: Preferences
                Section(store.t("settings.section.preferences")) {

                    // Language
                    Picker(store.t("settings.language"), selection: Binding(
                        get: { store.language },
                        set: { store.setLanguage($0) }
                    )) {
                        Text(store.t("settings.language.de")).tag("de")
                        Text(store.t("settings.language.en")).tag("en")
                    }

                    // Theme
                    Picker(store.t("settings.theme"), selection: Binding(
                        get: { store.themeMode },
                        set: { store.setThemeMode($0) }
                    )) {
                        Text(store.t("settings.theme.system")).tag("system")
                        Text(store.t("settings.theme.light")).tag("light")
                        Text(store.t("settings.theme.dark")).tag("dark")
                    }

                    // Notifications
                    Toggle(isOn: $notificationsEnabled) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(store.t("settings.notifications"))
                            Text(store.t("settings.notifications.sub"))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .onChange(of: notificationsEnabled) { _, enabled in
                        UserDefaults.standard.set(enabled, forKey: notifKey)
                        if enabled {
                            NotificationManager.shared.requestPermissions()
                        }
                        NotificationManager.shared.scheduleDailyReminder(language: store.language, enabled: enabled)
                    }
                }

                // MARK: Links
                Section(store.t("settings.section.links")) {
                    Link(destination: URL(string: "https://gymnio.fringelo.com/privacy-policy/")!) {
                        Label(store.t("settings.privacy"), systemImage: "lock.shield")
                    }
                    Link(destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!) {
                        Label(store.t("settings.terms"), systemImage: "doc.text")
                    }
                }

                // MARK: About
                Section(store.t("settings.section.about")) {
                    Link(destination: URL(string: "https://github.com/alexmen656/gymapp")!) {
                        Label(store.t("settings.github"), systemImage: "chevron.left.forwardslash.chevron.right")
                    }
                    HStack {
                        Text(store.t("settings.about"))
                        Spacer()
                        Text(appVersion)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle(store.t("settings.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(store.t("common.ok")) { dismiss() }
                }
            }
            .onAppear {
                notificationsEnabled = UserDefaults.standard.bool(forKey: notifKey)
            }
        }
    }

    private var appVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
    }
}
