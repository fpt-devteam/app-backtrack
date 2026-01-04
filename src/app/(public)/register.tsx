import { RegisterForm } from '@/src/features/auth/components';
import { AppBrandHeader } from '@/src/shared/components';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const RegisterScreen = () => {
  return (
    <View className="flex-1">
      {/* Brand */}
      <View className="w-full pt-8">
        <AppBrandHeader message="Start tracking your belongings today." />
      </View>

      {/* Form */}
      <View className="flex-1">
        <RegisterForm />
      </View>

      {/* Footer */}
      <View className="flex-row gap-2 justify-center items-center">
        <Text className="text-normal text-base">Already have an account?</Text>
        <Link href="/login" className="text-base font-display text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default RegisterScreen;
