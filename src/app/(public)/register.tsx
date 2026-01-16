import { RegisterForm } from '@/src/features/auth/components';
import { AppLogo } from '@/src/shared/components/app-utils/AppLogo';
import { Link } from 'expo-router';
import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const RegisterScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex my-10 items-center justify-center pt-10">
              <AppLogo width={300} height={60} />
            </View>

            <View className="flex-1 px-4">
              <RegisterForm />
            </View>

            <View className="flex-row gap-2 justify-center items-center py-6 mt-4">
              <Text className="text-normal text-base ">
                Already have an account?
              </Text>
              <Link
                href="/login"
                className="text-base font-display text-primary font-bold"
              >
                Sign In
              </Link>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;