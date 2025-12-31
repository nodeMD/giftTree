import {
  DeleteAccountModal,
  NotificationsModal,
  PrivacyPolicyModal,
  SettingsItem,
  ThemeSelectionModal,
} from "@/components/settings";
import { themeLabels } from "@/constants/settings";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { theme, isDark } = useTheme();
  const deleteAccount = useDeleteAccount();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
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
        <SettingsItem
          label="Theme"
          value={themeLabels[theme]}
          onPress={() => setShowThemeModal(true)}
          isDark={isDark}
        />

        <SettingsItem
          label="Privacy Policy"
          onPress={() => setShowPrivacyPolicy(true)}
          isDark={isDark}
        />

        <SettingsItem
          label="Notifications Settings"
          onPress={() => setShowNotificationsModal(true)}
          isDark={isDark}
        />

        <SettingsItem
          label="Log Out"
          onPress={handleLogout}
          variant="primary"
          isDark={isDark}
        />

        <SettingsItem
          label="Delete Account"
          onPress={deleteAccount.open}
          variant="danger"
          showBorder={false}
          isDark={isDark}
        />
      </View>

      {/* Modals */}
      <ThemeSelectionModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      <PrivacyPolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      <NotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />

      <DeleteAccountModal
        visible={deleteAccount.showModal}
        onClose={deleteAccount.close}
        nicknameInput={deleteAccount.nicknameInput}
        onNicknameChange={deleteAccount.handleNicknameChange}
        isDeleting={deleteAccount.isDeleting}
        error={deleteAccount.error}
        onConfirmDelete={deleteAccount.confirmDelete}
        userNickname={deleteAccount.userNickname}
      />
    </View>
  );
}
