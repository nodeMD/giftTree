import Logo from "@/components/Logo";
import { completePasswordReset, sendPasswordReset } from "@/services/appwrite";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPasswordScreen() {
  // Check for deep link params (userId & secret from Appwrite recovery email)
  const { userId, secret } = useLocalSearchParams<{
    userId?: string;
    secret?: string;
  }>();
  const isRecoveryMode = !!(userId && secret);

  // Request reset state
  const [email, setEmail] = useState("");

  // Complete reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Shared state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset request error:", err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteReset = async () => {
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await completePasswordReset(userId!, secret!, newPassword);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err?.message?.includes("expired")) {
        setError("Reset link has expired. Please request a new one.");
      } else {
        setError("Failed to reset password. Please try again.");
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

          {/* Back Link */}
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity
              className="flex-row items-center mb-6"
              disabled={isLoading}
            >
              <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm">
                ← Back to login
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-2">
              {isRecoveryMode ? "Set New Password" : "Reset Password"}
            </Text>
            <Text className="text-foreground-secondary dark:text-foreground-dark-secondary text-sm text-center">
              {isRecoveryMode
                ? "Enter your new password below"
                : "Enter your email to receive password reset instructions"}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {error ? (
              <View className="p-3 rounded-lg bg-danger-light dark:bg-danger/20 border border-danger-border dark:border-danger/30 mb-4">
                <Text className="text-danger text-sm">{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View className="p-3 rounded-lg bg-primary-50 dark:bg-primary/20 border border-primary-200 dark:border-primary/30 mb-4">
                <Text className="text-primary text-sm">
                  {isRecoveryMode
                    ? "Password reset successful! Redirecting to login..."
                    : "Reset instructions sent! Check your email."}
                </Text>
              </View>
            ) : null}

            {!success && (
              <>
                {isRecoveryMode ? (
                  // Complete Reset Form (when opened via deep link)
                  <>
                    <View className="mb-4">
                      <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                        New Password
                      </Text>
                      <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                        placeholder="Enter new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                    </View>

                    <View className="mb-6">
                      <Text className="text-sm text-foreground dark:text-foreground-dark font-medium mb-2">
                        Confirm Password
                      </Text>
                      <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        className="w-full px-4 py-3 rounded-lg border border-border dark:border-border-dark bg-background dark:bg-background-dark-secondary text-foreground dark:text-foreground-dark"
                        placeholder="Confirm new password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handleCompleteReset}
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-lg ${isLoading ? "bg-primary-light" : "bg-primary active:bg-primary-dark"}`}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white text-center font-semibold text-base">
                          Set New Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  // Request Reset Form (default)
                  <>
                    <View className="mb-6">
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
                    </View>

                    <TouchableOpacity
                      onPress={handleRequestReset}
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-lg ${isLoading ? "bg-primary-light" : "bg-primary active:bg-primary-dark"}`}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white text-center font-semibold text-base">
                          Reset Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
