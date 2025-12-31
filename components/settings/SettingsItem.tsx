import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";

type SettingsItemVariant = "default" | "primary" | "danger";

interface SettingsItemProps {
  label: string;
  value?: string;
  onPress: () => void;
  variant?: SettingsItemVariant;
  showBorder?: boolean;
  isDark?: boolean;
}

const variantStyles: Record<
  SettingsItemVariant,
  { textClass: string; iconColor: string }
> = {
  default: {
    textClass: "text-foreground dark:text-foreground-dark",
    iconColor: "#9CA3AF",
  },
  primary: {
    textClass: "text-primary",
    iconColor: "#16A34A",
  },
  danger: {
    textClass: "text-danger",
    iconColor: "#DC2626",
  },
};

export function SettingsItem({
  label,
  value,
  onPress,
  variant = "default",
  showBorder = true,
  isDark = false,
}: SettingsItemProps) {
  const styles = variantStyles[variant];
  const borderClass = showBorder
    ? "border-b border-border dark:border-border-dark"
    : "";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 ${borderClass}`}
    >
      <Text className={`${styles.textClass} text-base`}>{label}</Text>
      <View className="flex-row items-center">
        {value && (
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary mr-2">
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={20} color={styles.iconColor} />
      </View>
    </TouchableOpacity>
  );
}
