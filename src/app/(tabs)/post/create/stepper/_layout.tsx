import { useCreatePost, usePostCreationStore } from "@/src/features/post/hooks";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { PostCreateRequest } from "@/src/features/post/types";
import { AppLink, AppLoader } from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { POST_ROUTE } from "@/src/shared/constants";
import { useUploadImage } from "@/src/shared/hooks";
import { colors, typography } from "@/src/shared/theme";
import { ImagePickerAsset } from "expo-image-picker";
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
  const { uploadImages, isUploadingImages } = useUploadImage();
  const { createPost, isCreatingPost } = useCreatePost();

  const [currentStep, setCurrentStep] = useState(0);

  const debug = usePostCreationStore((state) => state.debug);

  const postType = usePostCreationStore((state) => state.postType);
  const category = usePostCreationStore((state) => state.category);
  const subCategory = usePostCreationStore((state) => state.subCategory);
  const images = usePostCreationStore((state) => state.images);
  const location = usePostCreationStore((state) => state.location);
  const timelineDate = usePostCreationStore((state) => state.timeline.date);

  const resetForm = usePostCreationStore((state) => state.resetForm);

  const electronicDetail = usePostCreationStore(
    (state) => state.electronicDetail,
  );

  const isIdentityStepInvalid = currentStep === 2 && images.length === 0;
  const isLocationStepInvalid = currentStep === 3 && !location.coords;
  const isTimelineStepInvalid =
    currentStep === 4 &&
    (!timelineDate || !eventTimeSchema.isValidSync(timelineDate));
  const isNextDisabled =
    isIdentityStepInvalid || isLocationStepInvalid || isTimelineStepInvalid;

  const handleNext = () => {
    debug();

    if (currentStep >= STEPS.length - 1) {
      handleSubmit();
      return;
    }

    const newStep = Math.min(currentStep + 1, STEPS.length - 1);
    setCurrentStep(newStep);
    router.push(STEPS[newStep].path);
  };

  const handleBack = () => {
    router.back();

    const newStep = Math.max(currentStep - 1, 0);
    setCurrentStep(newStep);
  };

  const handleUploadImages = async (picked: ImagePickerAsset[]) => {
    const uploadRes = await uploadImages(picked);
    if (!uploadRes) return [];
    return uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
  };

  const handleSubmit = async () => {
    try {
      const imageUrls = await handleUploadImages(images);

      const req: PostCreateRequest = {
        postType,
        category,
        subcategoryCode: subCategory,
        imageUrls,
        location: location.coords,
        externalPlaceId: location.placeId,
        displayAddress: location.address,
        eventTime: timelineDate ?? new Date(),
        electronicDetail,
      };

      const postDetails = await createPost(req);
      const postId = postDetails?.id;
      if (!postId) {
        toast.error("Failed to create post. Please try again.");
        return;
      }

      resetForm();

      router.push(
        POST_ROUTE.matching(postId) as RelativePathString | ExternalPathString,
      );
    } catch (e) {
      console.warn("Submit failed", e);
      toast.error("Failed to create post. Please try again.");
    }
  };

  const handleCancel = () => {
    router.dismissAll();
    resetForm();
  };

  const isLoading = isUploadingImages || isCreatingPost;

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
              headerTitle: "Item Classification",
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
            }}
          />

          <Stack.Screen
            name="sub-category"
            options={{
              headerShown: true,
              headerTitle: "Detailed Classification",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
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
            }}
          />

          <Stack.Screen
            name="location"
            options={{
              headerShown: true,
              headerTitle: "Pinpoint location",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
            }}
          />

          <Stack.Screen
            name="timeline"
            options={{
              headerShown: true,
              headerTitle: "Occurrence time",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
            }}
          />

          <Stack.Screen
            name="detail"
            options={{
              headerShown: true,
              headerTitle: "Detail Identification",
              headerBackVisible: false,
              headerTitleStyle: {
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight
                  .normal as TextStyle["fontWeight"],
              },
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
        <AppLink
          title="Back"
          onPress={handleBack}
          size="base"
          disabled={isLoading}
        />

        <TouchableOpacity
          className=" border bg-secondary rounded-sm px-lg py-md"
          onPress={handleNext}
          disabled={isNextDisabled || isLoading}
          style={{ opacity: isNextDisabled || isLoading ? 0.4 : 1 }}
        >
          {isLoading ? (
            <AppLoader colorClass="bg-white" />
          ) : (
            <Text className="text-base font-normal text-center text-white tracking-label">
              {currentStep < STEPS.length - 1 ? "Next" : "Submit"}
            </Text>
          )}
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
