import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var notificationsEnabled = false

    private let notifKey = "daily_reminder_enabled"

    var body: some View {
        ZStack {
            LinearGradient(colors: gymGradientColors(scheme), startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {

                SettingsSectionTitle(title: store.t("settings.section.preferences"))

                GlassCard {
                    VStack(spacing: 0) {
                        SettingsRow(icon: "globe", iconColor: .statBlue, label: store.t("settings.language")) {
                            Picker("", selection: Binding(
                                get: { store.languageOverride },
                                set: { store.setLanguageOverride($0) }
                            )) {
                                Text(store.t("settings.language.de")).tag("de")
                                Text(store.t("settings.language.en")).tag("en")
                            }
                            .pickerStyle(.menu)
                            .foregroundColor(.statBlue)
                        }

                        Divider().padding(.leading, 44)

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

                        SettingsRow(icon: "bell.fill", iconColor: Color(hex: "FF9500"), label: store.t("settings.notifications")) {
                            Toggle("", isOn: $notificationsEnabled)
                                .labelsHidden()
                                .onChange(of: notificationsEnabled) { _, enabled in
                                    UserDefaults.standard.set(enabled, forKey: notifKey)
                                    if enabled { NotificationManager.shared.requestPermissions() }
                                    NotificationManager.shared.scheduleDailyReminder(enabled: enabled)
                                }
                        }
                    }
                }

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

                SettingsSectionTitle(title: store.t("settings.section.about"))

                GlassCard {
                    VStack(spacing: 0) {
                        SettingsLinkRow(icon: "chevron.left.forwardslash.chevron.right",
                                        iconColor: scheme == .dark ? Color(hex: "2c2c2e") : Color(hex: "1a1a1a"),
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
        }
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
