import { useAuth } from '@/contexts/AuthContext';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [nicknameOrEmail, setNicknameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!nicknameOrEmail || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // TODO: Validate credentials with backend
      await signIn(nicknameOrEmail);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Invalid credentials');
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

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-semibold text-gray-900 mb-1">Welcome Back</Text>
            <Text className="text-gray-500 text-sm">Log in to continue planting trees</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {error ? (
              <View className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                <Text className="text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <View className="mb-4">
              <Text className="text-sm text-gray-700 font-medium mb-2">Nickname or Email</Text>
              <TextInput
                value={nicknameOrEmail}
                onChangeText={setNicknameOrEmail}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Enter your nickname or email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-2">
              <Text className="text-sm text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Link href="/(auth)/reset-password" asChild>
              <TouchableOpacity className="self-end mb-4">
                <Text className="text-green-600 text-sm">Forgot password?</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              onPress={handleLogin}
              className="w-full py-3.5 bg-green-600 rounded-lg active:bg-green-700"
            >
              <Text className="text-white text-center font-semibold text-base">Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-sm">
              Don't have an account?{' '}
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

