import { UserSubscriptionPlanDetailCard } from "@/src/features/qr/components";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileMenuTabScreen = () => {
  const router = useRouter();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="flex-1 flex-row">
      {/* 1. Menu Content: flex-1 will take all REMAINING space */}
      <View className="flex-1 bg-surface shadow-2xl">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="p-4 border-b border-divider flex-row justify-between items-center">
            <View>
              <Text className="text-xl font-bold text-textPrimary">Menu</Text>
              <Text className="text-xs text-textSecondary">
                Manage your preferences
              </Text>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <UserSubscriptionPlanDetailCard />

            <View className="mt-6">
              <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Quick Actions
              </Text>
              <View className="h-20 w-full bg-canvas rounded-2xl border border-dashed border-divider items-center justify-center">
                <Text className="text-slate-400">Additional Menu Items...</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>

      {/* 2. Dismiss Overlay: Hardcoded width */}
      {/* w-12 in Tailwind is 48px. Use w-[40px] for custom pixel values */}
      <Pressable className="w-12 bg-black/40 h-full" onPress={handleClose} />
    </View>
  );
};

export default ProfileMenuTabScreen;
