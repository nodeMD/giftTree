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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!nickname) {
      newErrors.nickname = "Nickname is required";
    } else if (nickname.length < 3) {
      newErrors.nickname = "Nickname must be at least 3 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signUp(email, password, nickname);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error?.message?.includes("already exists") || error?.code === 409) {
        setErrors({ general: "An account with this email already exists" });
      } else if (error?.message?.includes("Invalid email")) {
        setErrors({ email: "Please enter a valid email address" });
      } else if (error?.message?.includes("password")) {
        setErrors({ password: "Password must be at least 8 characters" });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-1 items-center justify-center p-6 min-h-screen">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <Logo />

          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-1">
              Create Account
            </Text>
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Sign up to start planting trees
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {errors.general ? (
              <View className="p-3 rounded-lg bg-danger-light dark:bg-danger/20 border border-danger-border dark:border-danger/30 mb-4">
                <Text className="text-danger text-sm">{errors.general}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email ? (
                <Text className="mt-1 text-sm text-danger">{errors.email}</Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                Nickname
              </Text>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                placeholder="Choose a nickname"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.nickname ? (
                <Text className="mt-1 text-sm text-danger">
                  {errors.nickname}
                </Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.password ? (
                <Text className="mt-1 text-sm text-danger">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <View className="mb-6">
              <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.confirmPassword ? (
                <Text className="mt-1 text-sm text-danger">
                  {errors.confirmPassword}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg ${isLoading ? "bg-primary-light" : "bg-primary active:bg-primary-dark"}`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-6 items-center">
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
              Already have an account?{" "}
              <Link href="/(auth)/login" asChild>
                <Text className="text-primary font-medium">Log in</Text>
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
