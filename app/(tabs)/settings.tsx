import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getDailyNotificationPreference,
  setDailyNotificationPreference,
} from "@/services/notifications";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { signOut, deleteAccount, user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [dailyNotificationsEnabled, setDailyNotificationsEnabled] =
    useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Load notification preference on mount
  useEffect(() => {
    getDailyNotificationPreference().then(setDailyNotificationsEnabled);
  }, []);

  const handleToggleDailyNotifications = async (value: boolean) => {
    setDailyNotificationsEnabled(value);
    await setDailyNotificationPreference(value);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (nicknameInput !== user?.nickname) {
      setDeleteError("Nickname doesn't match. Please try again.");
      return;
    }

    setDeleteError("");
    setIsDeleting(true);
    try {
      await deleteAccount();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setNicknameInput("");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setNicknameInput("");
    setDeleteError("");
  };

  const handleNicknameChange = (text: string) => {
    setNicknameInput(text);
    if (deleteError) setDeleteError("");
  };

  const themeLabels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark">
          Settings
        </Text>
      </View>

      {/* Settings List */}
      <View className="flex-1 px-4">
        {/* Theme */}
        <TouchableOpacity
          onPress={() => setShowThemeModal(true)}
          className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark"
        >
          <Text className="text-foreground dark:text-foreground-dark text-base">
            Theme
          </Text>
          <View className="flex-row items-center">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary mr-2">
              {themeLabels[theme]}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9CA3AF" : "#9CA3AF"}
            />
          </View>
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity
          className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark"
          onPress={() => setShowPrivacyPolicy(true)}
        >
          <Text className="text-foreground dark:text-foreground-dark text-base">
            Privacy Policy
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9CA3AF" : "#9CA3AF"}
          />
        </TouchableOpacity>

        {/* Notifications Settings */}
        <TouchableOpacity
          className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark"
          onPress={() => setShowNotificationsModal(true)}
        >
          <Text className="text-foreground dark:text-foreground-dark text-base">
            Notifications Settings
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#9CA3AF" : "#9CA3AF"}
          />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark"
        >
          <Text className="text-primary text-base">Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#16A34A" />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="flex-row items-center justify-between py-4"
        >
          <Text className="text-danger text-base">Delete Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowThemeModal(false)}
        >
          <View className="bg-background dark:bg-background-dark-secondary rounded-2xl w-4/5 max-w-sm p-4">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4 text-center">
              Select Theme
            </Text>

            {(["light", "dark", "system"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setTheme(option);
                  setShowThemeModal(false);
                }}
                className={`flex-row items-center justify-between py-3 px-4 rounded-lg mb-2 ${
                  theme === option
                    ? "bg-primary/10"
                    : "bg-background-secondary dark:bg-background-dark-tertiary"
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      option === "light"
                        ? "sunny"
                        : option === "dark"
                          ? "moon"
                          : "phone-portrait"
                    }
                    size={20}
                    color={
                      theme === option
                        ? "#16A34A"
                        : isDark
                          ? "#9CA3AF"
                          : "#6B7280"
                    }
                  />
                  <Text
                    className={`ml-3 text-base ${
                      theme === option
                        ? "text-primary font-medium"
                        : "text-foreground dark:text-foreground-dark"
                    }`}
                  >
                    {themeLabels[option]}
                  </Text>
                </View>
                {theme === option && (
                  <Ionicons name="checkmark" size={20} color="#16A34A" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowThemeModal(false)}
              className="mt-2 py-3 bg-primary rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={closeDeleteModal}
          >
            <Pressable
              className="bg-background dark:bg-background-dark rounded-2xl w-4/5 max-w-sm p-4"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-danger">
                  Delete Account
                </Text>
                <TouchableOpacity onPress={closeDeleteModal}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="h-px bg-border dark:bg-border-dark mb-4" />

              {/* Instructions */}
              <Text className="text-foreground dark:text-foreground-dark text-base mb-4">
                To confirm deletion, please type your nickname:{" "}
                <Text className="font-semibold">{user?.nickname}</Text>
              </Text>

              {/* Input */}
              <TextInput
                value={nicknameInput}
                onChangeText={handleNicknameChange}
                placeholder="Enter your nickname"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                className={`border rounded-lg px-4 py-3 text-foreground dark:text-foreground-dark ${
                  deleteError
                    ? "border-danger"
                    : "border-border dark:border-border-dark"
                }`}
              />

              {/* Error Message */}
              {deleteError ? (
                <Text className="text-danger text-sm mt-2 mb-4">
                  {deleteError}
                </Text>
              ) : (
                <View className="mb-4" />
              )}

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={closeDeleteModal}
                  className="flex-1 py-3 bg-background-secondary dark:bg-background-dark-secondary rounded-lg"
                >
                  <Text className="text-foreground dark:text-foreground-dark text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirmDelete}
                  disabled={isDeleting}
                  className={`flex-1 py-3 rounded-lg ${
                    isDeleting ? "bg-danger/50" : "bg-danger"
                  }`}
                >
                  <Text className="text-white text-center font-semibold">
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyPolicy}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/50 justify-center items-center"
            onPress={() => setShowPrivacyPolicy(false)}
          >
            <Pressable
              className="bg-background dark:bg-background-dark rounded-2xl w-4/5 max-w-sm p-4"
              onPress={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-primary">
                  Privacy Policy
                </Text>
                <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="h-px bg-border dark:bg-border-dark mb-4" />

              {/* Privacy Policy Content */}
              <ScrollView className="max-h-[70vh]">
                <Text className="text-foreground dark:text-foreground-dark text-base mb-4">
                  GiftTree is committed to protecting your privacy. This policy
                  outlines how we collect, use, and protect your personal
                  information.
                </Text>
                <Text className="text-foreground dark:text-foreground-dark text-base mb-4">
                  We do not collect any personal information from users unless
                  explicitly provided by you. Any data you share with us is used
                  solely for the purpose of providing our services.
                </Text>
                <Text className="text-foreground dark:text-foreground-dark text-base mb-4">
                  You have the right to access, update, or delete your personal
                  information at any time. If you have any questions about this
                  policy, please contact us.
                </Text>
              </ScrollView>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => setShowPrivacyPolicy(false)}
                className="mt-4 py-3 bg-primary rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Close
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowNotificationsModal(false)}
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
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
              >
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
              onPress={() => setShowNotificationsModal(false)}
              className="mt-4 py-3 bg-primary rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
