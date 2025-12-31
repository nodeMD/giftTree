import { themeLabels, ThemeOption } from "@/constants/settings";
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface ThemeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const themeIcons: Record<ThemeOption, keyof typeof Ionicons.glyphMap> = {
  light: "sunny",
  dark: "moon",
  system: "phone-portrait",
};

export function ThemeSelectionModal({
  visible,
  onClose,
}: ThemeSelectionModalProps) {
  const { theme, setTheme, isDark } = useTheme();

  const handleSelectTheme = (option: ThemeOption) => {
    setTheme(option);
    onClose();
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
        <View className="bg-background dark:bg-background-dark-secondary rounded-2xl w-4/5 max-w-sm p-4">
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-4 text-center">
            Select Theme
          </Text>

          {(["light", "dark", "system"] as const).map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => handleSelectTheme(option)}
              className={`flex-row items-center justify-between py-3 px-4 rounded-lg mb-2 ${
                theme === option
                  ? "bg-primary/10"
                  : "bg-background-secondary dark:bg-background-dark-tertiary"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={themeIcons[option]}
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
            onPress={onClose}
            className="mt-2 py-3 bg-primary rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
