import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    // TODO: Show delete confirmation modal
    console.log("Delete account requested");
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
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark">
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
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-border dark:border-border-dark">
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
                    color={theme === option ? "#16A34A" : isDark ? "#9CA3AF" : "#6B7280"}
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
    </View>
  );
}
