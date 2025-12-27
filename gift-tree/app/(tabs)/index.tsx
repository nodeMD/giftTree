import { fetchCatGif } from "@/services/api";
import useFetch from "@/services/useFetch";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { data, loading, error, refetch } = useFetch<{ url: string }>(fetchCatGif);
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">Progress</Text>
          <Text className="text-gray-500 text-sm">1,234/5000</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full mt-2">
          <View className="h-2 bg-green-600 rounded-full w-1/4" />
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center p-4">
        {/* GIF */}
        <View className="w-full aspect-square max-w-xs bg-gray-100 rounded-2xl items-center justify-center mb-8">
        {loading && (
              <ActivityIndicator
                size="large"
                color="#00ff00"
                className="top-4"
              />
            )}
            {error && (
              <Text className="text-red-500 top-4">
                Error: {error.message}
              </Text> 
            )}
            {data && (
              <Image source={{ uri: data.url }} className="w-full h-full" />
            )}
        </View>

        {/* Action Button */}
        <TouchableOpacity className="w-full max-w-xs py-4 bg-green-600 rounded-xl active:bg-green-700">
          <Text className="text-white text-center font-semibold text-base">
            Another one!
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ad Banner Placeholder */}
      <View className="h-16 bg-gray-100 items-center justify-center">
        <Text className="text-gray-400 text-sm">Ad Banner Placeholder</Text>
      </View>
    </View>
  );
}
