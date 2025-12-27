import { useAuth } from "@/contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleLogout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const handleDeleteAccount = () => {
    // TODO: Show delete confirmation modal
    console.log("Delete account requested");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-2xl font-semibold text-gray-900">Settings</Text>
      </View>

      {/* Settings List */}
      <View className="flex-1 px-4">
        {/* Theme */}
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <Text className="text-gray-900 text-base">Theme</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 mr-2">
              {theme === "light" ? "Light" : "Dark"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <Text className="text-gray-900 text-base">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Notifications Settings */}
        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <Text className="text-gray-900 text-base">
            Notifications Settings
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-between py-4 border-b border-gray-100"
        >
          <Text className="text-green-600 text-base">Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#16A34A" />
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="flex-row items-center justify-between py-4"
        >
          <Text className="text-red-600 text-base">Delete Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
