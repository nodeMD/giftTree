import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!nickname) {
      newErrors.nickname = 'Nickname is required';
    } else if (nickname.length < 3) {
      newErrors.nickname = 'Nickname must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // TODO: Create user in backend
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Error registering:', error);
        setErrors({ general: 'An error occurred' });
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6 min-h-screen">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-green-600 rounded-full items-center justify-center mb-2">
              <Text className="text-white text-2xl">🌲</Text>
            </View>
            <Text className="text-green-600 font-bold text-lg">GIFTREE</Text>
          </View>

          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-semibold text-gray-900 mb-1">Create Account</Text>
            <Text className="text-gray-500 text-sm">Sign up to start planting trees</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {errors.general ? (
              <View className="p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
                <Text className="text-red-600 text-sm">{errors.general}</Text>
              </View>
            ) : null}

            <View className="mb-4">
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
              {errors.email ? (
                <Text className="mt-1 text-sm text-red-600">{errors.email}</Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-700 font-medium mb-2">Nickname</Text>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Choose a nickname"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
              />
              {errors.nickname ? (
                <Text className="mt-1 text-sm text-red-600">{errors.nickname}</Text>
              ) : null}
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password ? (
                <Text className="mt-1 text-sm text-red-600">{errors.password}</Text>
              ) : null}
            </View>

            <View className="mb-6">
              <Text className="text-sm text-gray-700 font-medium mb-2">Confirm Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.confirmPassword ? (
                <Text className="mt-1 text-sm text-red-600">{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="w-full py-3.5 bg-green-600 rounded-lg active:bg-green-700"
            >
              <Text className="text-white text-center font-semibold text-base">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="mt-6 items-center">
            <Text className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/(auth)/login" asChild>
                <Text className="text-green-600 font-medium">Log in</Text>
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

