import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      // TODO: Send reset password email via backend
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to send reset email');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6 min-h-screen">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-2">
              <Text className="text-white text-2xl">🌲</Text>
            </View>
            <Text className="text-green-600 font-bold text-lg">GIFTREE</Text>
          </View>

          {/* Back Link */}
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity className="flex-row items-center mb-6">
              <Text className="text-gray-500 text-sm">← Back to login</Text>
            </TouchableOpacity>
          </Link>

          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-semibold text-gray-900 mb-2">Reset Password</Text>
            <Text className="text-gray-500 text-sm text-center">
              Enter your email to receive password reset instructions
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {error ? (
              <View className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            {success ? (
              <View className="p-3 rounded-lg bg-green-50 border border-green-200 mb-4">
                <Text className="text-green-600 text-sm">
                  Reset instructions sent! Check your email.
                </Text>
              </View>
            ) : null}

            <View className="mb-6">
              <Text className="text-sm text-gray-700 font-medium mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              onPress={handleReset}
              className="w-full py-3.5 bg-green-600 rounded-lg active:bg-green-700"
            >
              <Text className="text-white text-center font-semibold text-base">Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

