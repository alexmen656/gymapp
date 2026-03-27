import Foundation
import UserNotifications

final class NotificationManager {
    static let shared = NotificationManager()
    private init() {}

    func requestPermissions() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    }

    // MARK: - Daily reminder (legacy – kept for compatibility)

    func scheduleDailyReminder(enabled: Bool) {
        scheduleReminders(enabled ? [ReminderDay(weekday: 0, enabled: true, hour: 18, minute: 0)] : [])
    }

    // MARK: - Per-day reminders

    func scheduleReminders(_ days: [ReminderDay]) {
        let center = UNUserNotificationCenter.current()

        // Remove all existing reminder notifications
        let ids = (1...7).map { "reminder_day_\($0)" } + ["daily_reminder"]
        center.removePendingNotificationRequests(withIdentifiers: ids)

        let activeDays = days.filter { $0.enabled }
        guard !activeDays.isEmpty else { return }

        center.getNotificationSettings { settings in
            guard settings.authorizationStatus == .authorized else { return }

            let content = UNMutableNotificationContent()
            content.title = String(localized: "notification.reminder.title")
            content.body  = String(localized: "notification.reminder.body")
            content.sound = .default

            for day in activeDays {
                var components = DateComponents()
                components.hour    = day.hour
                components.minute  = day.minute
                if day.weekday >= 1 && day.weekday <= 7 {
                    components.weekday = day.weekday
                }

                let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: true)
                let request = UNNotificationRequest(
                    identifier: "reminder_day_\(day.weekday)",
                    content: content,
                    trigger: trigger
                )
                center.add(request)
            }
        }
    }

    // MARK: - Celebration

    func sendCelebrationNotification(entryCount: Int) {
        let center = UNUserNotificationCenter.current()
        center.getNotificationSettings { settings in
            guard settings.authorizationStatus == .authorized else { return }

            let content = UNMutableNotificationContent()
            content.title = String(localized: "notification.celebration.title")
            content.body  = String(format: String(localized: "notification.celebration.body"), entryCount)
            content.sound = .default

            let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
            let request = UNNotificationRequest(identifier: "celebration_\(entryCount)", content: content, trigger: trigger)
            center.add(request)
        }
    }

    func cancelDailyReminder() {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["daily_reminder"])
    }
}
