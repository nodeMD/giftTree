import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const NOTIFICATION_PREFERENCE_KEY = "daily_notifications_enabled";
const DAILY_NOTIFICATION_ID = "daily-reminder";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyNotification(): Promise<void> {
  // Cancel any existing daily notification first
  await cancelDailyNotification();

  // Schedule notification for 10:00 AM every day
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌳 Time to grow your tree!",
      body: "Don't forget to visit GifTree today and help your tree grow!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
    identifier: DAILY_NOTIFICATION_ID,
  });
}

export async function cancelDailyNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
}

export async function getDailyNotificationPreference(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_PREFERENCE_KEY);
    return value === "true";
  } catch {
    return false;
  }
}

export async function setDailyNotificationPreference(
  enabled: boolean,
): Promise<void> {
  await AsyncStorage.setItem(
    NOTIFICATION_PREFERENCE_KEY,
    enabled ? "true" : "false",
  );

  if (enabled) {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await scheduleDailyNotification();
    }
  } else {
    await cancelDailyNotification();
  }
}

// Initialize notifications on app start
export async function initializeNotifications(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Daily Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // Restore scheduled notification if preference is enabled
  const isEnabled = await getDailyNotificationPreference();
  if (isEnabled) {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await scheduleDailyNotification();
    }
  }
}
