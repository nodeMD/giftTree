import { ScrollView, Text, View } from "react-native";

// Placeholder data - will be replaced with actual data from backend
const trees: { id: string; name: string; location: string }[] = [];

export default function TreesScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <Text className="text-xl font-semibold text-gray-900 text-center">
          Trees planted by you
        </Text>
      </View>

      {/* Content */}
      {trees.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-6xl mb-4">🌲</Text>
          <Text className="text-gray-500 text-center">
            No trees planted yet, keep clicking!
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {/* Success Banner */}
          <View className="bg-green-600 rounded-xl py-3 px-4 mb-4">
            <Text className="text-white text-center font-medium">
              You planted {trees.length} trees. Hooray!
            </Text>
          </View>

          {/* Tree List */}
          {trees.map((tree) => (
            <View
              key={tree.id}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🌲</Text>
              </View>
              <View>
                <Text className="text-gray-900 font-medium">{tree.name}</Text>
                <Text className="text-gray-500 text-sm">{tree.location}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Ad Banner Placeholder */}
      <View className="h-16 bg-gray-100 items-center justify-center">
        <Text className="text-gray-400 text-sm">Ad Banner Placeholder</Text>
      </View>
    </View>
  );
}
