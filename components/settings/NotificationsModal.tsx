import { useTheme } from "@/contexts/ThemeContext";
import {
  getDailyNotificationPreference,
  setDailyNotificationPreference,
} from "@/services/notifications";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsModal({
  visible,
  onClose,
}: NotificationsModalProps) {
  const { isDark } = useTheme();
  const [dailyNotificationsEnabled, setDailyNotificationsEnabled] =
    useState(false);

  useEffect(() => {
    getDailyNotificationPreference().then(setDailyNotificationsEnabled);
  }, []);

  const handleToggleDailyNotifications = async (value: boolean) => {
    setDailyNotificationsEnabled(value);
    await setDailyNotificationPreference(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-background dark:bg-background-dark rounded-2xl w-4/5 max-w-sm p-4"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              Notifications
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Daily Notifications Toggle */}
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-1 mr-4">
              <Text className="text-foreground dark:text-foreground-dark text-base font-medium">
                Daily Notifications
              </Text>
              <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm mt-1">
                Get reminded to plant trees every day
              </Text>
            </View>
            <Switch
              value={dailyNotificationsEnabled}
              onValueChange={handleToggleDailyNotifications}
              trackColor={{ false: "#D1D5DB", true: "#16A34A" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Done Button */}
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 py-3 bg-primary rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
