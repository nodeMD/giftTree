import { MAX_CLICKS } from "@/constants/app";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCatGif } from "@/services/api";
import useFetch from "@/services/useFetch";
import { CatGifResponse } from "@/types/api";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { user, incrementClickCount } = useAuth();
  const { data, loading, error, refetch } =
    useFetch<CatGifResponse>(fetchCatGif);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasIncrementedOnMount = useRef(false);

  // Increment counter on initial page load (when first GIF is shown)
  useEffect(() => {
    if (!hasIncrementedOnMount.current) {
      hasIncrementedOnMount.current = true;
      incrementClickCount();
    }
  }, [incrementClickCount]);

  const clickCount = user?.clickCount || 0;
  const progressPercent = Math.min((clickCount / MAX_CLICKS) * 100, 100);

  // Show loader while API is fetching OR image is still loading
  const isLoading = loading || (data && !imageLoaded);

  const handleClick = async () => {
    setImageLoaded(false); // Reset image loading state
    await incrementClickCount();
    refetch();
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
            Progress (keep 50 clicks per day 🌲)
          </Text>
          <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
            {clickCount.toLocaleString()} / {MAX_CLICKS.toLocaleString()}
          </Text>
        </View>
        <View className="h-2 bg-background-tertiary dark:bg-background-dark-tertiary rounded-full mt-2 overflow-hidden">
          <View
            className="h-2 bg-primary rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center p-4">
        {/* GIF */}
        <View className="w-full aspect-square max-w-xs bg-background-secondary dark:bg-background-dark-secondary rounded-2xl items-center justify-center mb-8 overflow-hidden">
          {isLoading && <ActivityIndicator size="large" color="#16A34A" />}
          {error && (
            <Text className="text-danger px-4 text-center">
              Error: {error.message}
            </Text>
          )}
          {data && (
            <Image
              source={{ uri: data.url }}
              className={`w-full h-full ${!imageLoaded ? "opacity-0 absolute" : ""}`}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleClick}
          disabled={!!isLoading}
          className={`w-full max-w-xs py-4 rounded-xl ${
            isLoading ? "bg-primary-light" : "bg-primary active:bg-primary-dark"
          }`}
        >
          <Text className="text-white text-center font-semibold text-base">
            Another one!
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ad Banner Placeholder */}
      <View className="h-16 bg-background-secondary dark:bg-background-dark-secondary items-center justify-center">
        <Text className="text-foreground-muted dark:text-foreground-dark-muted text-sm">
          Ad Banner Placeholder
        </Text>
      </View>
    </View>
  );
}
