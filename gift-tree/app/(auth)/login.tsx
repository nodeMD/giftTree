import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err?.message?.includes("Invalid credentials")) {
        setError("Invalid email or password");
      } else if (err?.message?.includes("Invalid email")) {
        setError("Please enter a valid email address");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6 min-h-screen">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <Logo />

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-semibold text-gray-900 mb-1">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-sm">
              Log in to continue planting trees
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {error ? (
              <View className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="text-sm text-gray-700 font-medium mb-2">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View className="mb-2">
              <Text className="text-sm text-gray-700 font-medium mb-2">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <Link href="/(auth)/reset-password" asChild>
              <TouchableOpacity className="self-end mb-4" disabled={isLoading}>
                <Text className="text-green-600 text-sm">Forgot password?</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg ${isLoading ? "bg-green-400" : "bg-green-600 active:bg-green-700"}`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Log In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/(auth)/register" asChild>
                <Text className="text-green-600 font-medium">Sign up</Text>
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
