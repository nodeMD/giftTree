import { ScrollView, Text, View } from "react-native";

// Placeholder data - will be replaced with actual data from backend
const trees: { id: string; name: string; location: string }[] = [];

export default function TreesScreen() {
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-xl font-semibold text-foreground dark:text-foreground-dark text-center">
          Trees planted by you
        </Text>
      </View>

      {/* Content */}
      {trees.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-6xl mb-4">🌲</Text>
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-center">
            No trees planted yet, keep clicking!
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {/* Success Banner */}
          <View className="bg-primary rounded-xl py-3 px-4 mb-4">
            <Text className="text-white text-center font-medium">
              You planted {trees.length} trees. Hooray!
            </Text>
          </View>

          {/* Tree List */}
          {trees.map((tree) => (
            <View
              key={tree.id}
              className="flex-row items-center py-3 border-b border-border dark:border-border-dark"
            >
              <View className="w-10 h-10 bg-primary-100 dark:bg-primary-700 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🌲</Text>
              </View>
              <View>
                <Text className="text-foreground dark:text-foreground-dark font-medium">
                  {tree.name}
                </Text>
                <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                  {tree.location}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Ad Banner Placeholder */}
      <View className="h-16 bg-background-secondary dark:bg-background-dark-secondary items-center justify-center">
        <Text className="text-foreground-muted dark:text-foreground-dark-muted text-sm">
          Ad Banner Placeholder
        </Text>
      </View>
    </View>
  );
}
