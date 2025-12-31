import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({
  visible,
  onClose,
}: PrivacyPolicyModalProps) {
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
              <Text className="text-lg font-semibold text-primary">
                Privacy Policy
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
              onPress={onClose}
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
  );
}
