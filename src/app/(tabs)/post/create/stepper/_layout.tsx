import { usePostCreationStore } from "@/src/features/post/hooks";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { AppBackButton, AppLink } from "@/src/shared/components";
import { POST_ROUTE } from "@/src/shared/constants";
import { colors, typography } from "@/src/shared/theme";
import {
  ExternalPathString,
  RelativePathString,
  router,
  Stack,
} from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import { Text, TextStyle, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS: { path: ExternalPathString | RelativePathString }[] = [
  { path: POST_ROUTE.category },
  { path: POST_ROUTE.subCategory },
  { path: POST_ROUTE.identity },
  { path: POST_ROUTE.location },
  { path: POST_ROUTE.timeline },
  { path: POST_ROUTE.itemDetail },
];

const PostCreationStepperLayout = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const debug = usePostCreationStore((state) => state.debug);
  const images = usePostCreationStore((state) => state.images);
  const locationCoords = usePostCreationStore((state) => state.location.coords);
  const timelineDate = usePostCreationStore((state) => state.timeline.date);

  const isIdentityStepInvalid = currentStep === 2 && images.length === 0;
  const isLocationStepInvalid = currentStep === 3 && !locationCoords;
  const isTimelineStepInvalid =
    currentStep === 4 &&
    (!timelineDate || !eventTimeSchema.isValidSync(timelineDate));

  const isNextDisabled =
    isIdentityStepInvalid || isLocationStepInvalid || isTimelineStepInvalid;

  const handleNext = () => {
    debug();

    if (currentStep >= STEPS.length - 1) return;
    const newStep = Math.min(currentStep + 1, STEPS.length - 1);
    setCurrentStep(newStep);
    router.push(STEPS[newStep].path);
  };

  const handleBack = () => {
    router.back();

    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "transparent" },
          }}
        >
          <Stack.Screen
            name="category"
            options={{
              headerShown: true,
              headerTitle: "Select category",
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
              headerRight: () => <AppBackButton type="xIcon" />,
            }}
          />

          <Stack.Screen
            name="sub-category"
            options={{
              headerShown: true,
              headerTitle: "Select sub-category",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
              headerRight: () => <AppBackButton type="xIcon" />,
            }}
          />

          <Stack.Screen
            name="identity"
            options={{
              headerShown: true,
              headerTitle: "Visual Evidence",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
              headerRight: () => <AppBackButton type="xIcon" />,
            }}
          />

          <Stack.Screen
            name="location"
            options={{
              headerShown: true,
              headerTitle: "Location of Incident",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
              headerRight: () => <AppBackButton type="xIcon" />,
            }}
          />

          <Stack.Screen
            name="timeline"
            options={{
              headerShown: true,
              headerTitle: "Time of Incident",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
              headerRight: () => <AppBackButton type="xIcon" />,
            }}
          />
        </Stack>
      </View>

      {/* Step Indicator */}
      <View className="">
        <StepIndicator
          currentStep={currentStep + 1}
          totalSteps={STEPS.length}
        />
      </View>

      {/* Actions footer */}
      <View className="flex-row border-t justify-between items-center px-lg pt-md">
        <AppLink title="Back" onPress={handleBack} size="base" />

        <TouchableOpacity
          className=" border bg-secondary rounded-sm px-lg py-md"
          onPress={handleNext}
          disabled={isNextDisabled}
          style={{ opacity: isNextDisabled ? 0.4 : 1 }}
        >
          <Text className="text-base font-normal text-center text-white tracking-label">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostCreationStepperLayout;

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <View className="flex-row w-full bg-muted">
      {[...Array(totalSteps)].map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <View
            key={index}
            className="flex-1 h-1.5 bg-muted/20 overflow-hidden"
          >
            <MotiView
              from={{ width: "0%" }}
              animate={{
                width: isActive ? "100%" : "0%",
                backgroundColor: isActive ? colors.secondary : colors.muted,
              }}
              transition={{
                type: "timing",
                duration: 500,
              }}
              style={{
                height: "100%",
              }}
            />
          </View>
        );
      })}
    </View>
  );
};
