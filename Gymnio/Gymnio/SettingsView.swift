import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var notificationsEnabled = false

    private let notifKey = "daily_reminder_enabled"

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                // Preferences Section
                SettingsSectionTitle(title: store.t("settings.section.preferences"))

                GlassCard {
                    VStack(spacing: 0) {
                        // Language
                        SettingsRow(icon: "globe", iconColor: .statBlue, label: store.t("settings.language")) {
                            Picker("", selection: Binding(
                                get: { store.language },
                                set: { store.setLanguage($0) }
                            )) {
                                Text("Deutsch").tag("de")
                                Text("English").tag("en")
                            }
                            .pickerStyle(.menu)
                            .foregroundColor(.statBlue)
                        }

                        Divider().padding(.leading, 44)

                        // Theme
                        SettingsRow(icon: "moon.fill", iconColor: Color(hex: "8e44ad"), label: store.t("settings.theme")) {
                            Picker("", selection: Binding(
                                get: { store.themeMode },
                                set: { store.setThemeMode($0) }
                            )) {
                                Text(store.t("settings.theme.system")).tag("system")
                                Text(store.t("settings.theme.light")).tag("light")
                                Text(store.t("settings.theme.dark")).tag("dark")
                            }
                            .pickerStyle(.menu)
                            .foregroundColor(.statBlue)
                        }

                        Divider().padding(.leading, 44)

                        // Notifications
                        SettingsRow(icon: "bell.fill", iconColor: Color(hex: "FF9500"), label: store.t("settings.notifications")) {
                            Toggle("", isOn: $notificationsEnabled)
                                .labelsHidden()
                                .onChange(of: notificationsEnabled) { _, enabled in
                                    UserDefaults.standard.set(enabled, forKey: notifKey)
                                    if enabled { NotificationManager.shared.requestPermissions() }
                                    NotificationManager.shared.scheduleDailyReminder(language: store.language, enabled: enabled)
                                }
                        }
                    }
                }

                // Links Section
                SettingsSectionTitle(title: store.t("settings.section.links"))

                GlassCard {
                    VStack(spacing: 0) {
                        SettingsLinkRow(icon: "lock.shield.fill", iconColor: .statBlue,
                                        label: store.t("settings.privacy"),
                                        url: "https://gymnio.fringelo.com/privacy-policy/")
                        Divider().padding(.leading, 44)
                        SettingsLinkRow(icon: "doc.text.fill", iconColor: Color(hex: "34c759"),
                                        label: store.t("settings.terms"),
                                        url: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")
                    }
                }

                // About Section
                SettingsSectionTitle(title: store.t("settings.section.about"))

                GlassCard {
                    VStack(spacing: 0) {
                        SettingsLinkRow(icon: "chevron.left.forwardslash.chevron.right",
                                        iconColor: scheme == .dark ? .white : Color(hex: "1a1a1a"),
                                        label: store.t("settings.github"),
                                        url: "https://github.com/alexmen656/gymapp")
                        Divider().padding(.leading, 44)
                        SettingsRow(icon: "info.circle.fill", iconColor: .statBlue, label: "Gymnio") {
                            Text(appVersion)
                                .font(.system(size: 15))
                                .secondaryText()
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
            .padding(.bottom, 32)
        }
        .gymBackground()
        .navigationTitle(store.t("settings.title"))
        .navigationBarTitleDisplayMode(.large)
        .onAppear {
            notificationsEnabled = UserDefaults.standard.bool(forKey: notifKey)
        }
    }

    private var appVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
    }
}

// MARK: - Sub-components

struct SettingsSectionTitle: View {
    let title: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Text(title)
            .font(.system(size: 13, weight: .semibold))
            .foregroundColor(scheme == .dark ? Color(hex: "98989f") : Color(hex: "666666"))
            .textCase(.uppercase)
            .padding(.horizontal, 4)
            .padding(.top, 4)
    }
}

struct SettingsRow<Trailing: View>: View {
    let icon: String
    let iconColor: Color
    let label: String
    @ViewBuilder let trailing: () -> Trailing
    @Environment(\.colorScheme) var scheme

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(iconColor)
                .frame(width: 32, height: 32)
                .overlay(
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                )
            Text(label)
                .font(.system(size: 17))
                .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
            Spacer()
            trailing()
        }
        .padding(.vertical, 10)
    }
}

struct SettingsLinkRow: View {
    let icon: String
    let iconColor: Color
    let label: String
    let url: String

    var body: some View {
        Link(destination: URL(string: url)!) {
            SettingsRow(icon: icon, iconColor: iconColor, label: label) {
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.secondary)
            }
        }
        .buttonStyle(.plain)
    }
}
