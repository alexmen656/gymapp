import Foundation
import UserNotifications

final class NotificationManager {
    static let shared = NotificationManager()
    private init() {}

    func requestPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    }

    // MARK: - Daily reminder

    func scheduleDailyReminder(language: String, enabled: Bool) {
        let center = UNUserNotificationCenter.current()
        center.removePendingNotificationRequests(withIdentifiers: ["daily_reminder"])
        guard enabled else { return }

        let content = UNMutableNotificationContent()
        content.title = language == "de" ? "Zeit fürs Training! 💪" : "Time to work out! 💪"
        content.body = language == "de"
            ? "Vergiss nicht dein heutiges Training zu loggen."
            : "Don't forget to log today's workout."
        content.sound = .default

        var dateComponents = DateComponents()
        dateComponents.hour = 18
        dateComponents.minute = 0

        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: "daily_reminder", content: content, trigger: trigger)
        center.add(request)
    }

    // MARK: - Celebration

    func sendCelebrationNotification(entryCount: Int, language: String) {
        let center = UNUserNotificationCenter.current()
        center.getNotificationSettings { settings in
            guard settings.authorizationStatus == .authorized else { return }

            let content = UNMutableNotificationContent()
            if language == "de" {
                content.title = "Glückwunsch! 🎉"
                content.body = "Du hast \(entryCount) Einträge erreicht. Weiter so!"
            } else {
                content.title = "Congratulations! 🎉"
                content.body = "You've reached \(entryCount) entries. Keep it up!"
            }
            content.sound = .default

            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
            let request = UNNotificationRequest(
                identifier: "celebration_\(entryCount)",
                content: content,
                trigger: trigger
            )
            center.add(request)
        }
    }

    // MARK: - Cancel

    func cancelDailyReminder() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["daily_reminder"])
    }

    func cancelAll() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
    }
}
