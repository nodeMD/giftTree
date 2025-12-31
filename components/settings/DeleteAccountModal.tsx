import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  nicknameInput: string;
  onNicknameChange: (text: string) => void;
  isDeleting: boolean;
  error: string;
  onConfirmDelete: () => void;
  userNickname?: string;
}

export function DeleteAccountModal({
  visible,
  onClose,
  nicknameInput,
  onNicknameChange,
  isDeleting,
  error,
  onConfirmDelete,
  userNickname,
}: DeleteAccountModalProps) {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
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
              <Text className="text-lg font-semibold text-danger">
                Delete Account
              </Text>
              <TouchableOpacity onPress={onClose}>
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
              <Text className="font-semibold">{userNickname}</Text>
            </Text>

            {/* Input */}
            <TextInput
              value={nicknameInput}
              onChangeText={onNicknameChange}
              placeholder="Enter your nickname"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              className={`border rounded-lg px-4 py-3 text-foreground dark:text-foreground-dark ${
                error
                  ? "border-danger"
                  : "border-border dark:border-border-dark"
              }`}
            />

            {/* Error Message */}
            {error ? (
              <Text className="text-danger text-sm mt-2 mb-4">{error}</Text>
            ) : (
              <View className="mb-4" />
            )}

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 bg-background-secondary dark:bg-background-dark-secondary rounded-lg"
              >
                <Text className="text-foreground dark:text-foreground-dark text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirmDelete}
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
  );
}
