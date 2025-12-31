import React from "react";
import { Text, View } from "react-native";

export function AdBanner() {
  return (
    <View className="h-16 bg-background-secondary dark:bg-background-dark-secondary items-center justify-center">
      <Text className="text-foreground-muted dark:text-foreground-dark-muted text-sm">
        Ad Banner Placeholder
      </Text>
    </View>
  );
}
