import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleWorkoutReminder() {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  const reminderScheduled = await AsyncStorage.getItem("reminderScheduled");
  if (reminderScheduled === "true") {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Zeit für dein Workout! 💪",
      body: "Vergiss nicht, dein Training heute zu loggen!",
      data: { type: "workout-reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });

  await AsyncStorage.setItem("reminderScheduled", "true");
}

export async function scheduleMotivationalNotification() {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Wir vermissen dich! 🏋️",
      body: "Bereit für eine neue Trainingseinheit?",
      data: { type: "motivation" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24 * 3,
      repeats: false,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem("reminderScheduled");
}

export async function sendCelebrationNotification(milestone: number) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Glückwunsch! 🎉",
      body: `Du hast ${milestone} Workouts geloggt! Weiter so!`,
      data: { type: "celebration", milestone },
    },
    trigger: null,
  });
}
