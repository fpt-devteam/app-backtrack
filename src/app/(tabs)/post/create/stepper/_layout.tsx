import { useCreatePost, usePostCreationStore } from "@/src/features/post/hooks";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { CardDetail, PostCreateRequest } from "@/src/features/post/types";
import {
  AppBackButton,
  AppLink,
  AppLoader,
  TouchableIconButton,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { MenuBottomSheet } from "@/src/shared/components/ui/MenuBottomSheet";
import { POST_ROUTE } from "@/src/shared/constants";
import { ensureMediaPermission } from "@/src/shared/services";
import { colors, typography } from "@/src/shared/theme";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  requestCameraPermissionsAsync,
  type ImagePickerOptions,
} from "expo-image-picker";
import {
  ExternalPathString,
  RelativePathString,
  router,
  Stack,
  useNavigation,
} from "expo-router";
import { MotiView } from "moti";
import { HeadCircuitIcon, ImageIcon, CameraIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Text, TextStyle, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
  allowsMultipleSelection: true,
};

const CAMERA_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 1,
};

const STEP_KEY = {
  CATEGORY: "category",
  SUB_CATEGORY: "sub-category",
  IDENTITY: "identity",
  LOCATION: "location",
  TIMELINE: "timeline",
  DETAIL: "detail",
} as const;

type StepKey = (typeof STEP_KEY)[keyof typeof STEP_KEY];

const STEPS: { key: StepKey; path: ExternalPathString | RelativePathString }[] =
  [
    { key: STEP_KEY.CATEGORY, path: POST_ROUTE.category },
    { key: STEP_KEY.SUB_CATEGORY, path: POST_ROUTE.subCategory },
    { key: STEP_KEY.IDENTITY, path: POST_ROUTE.identity },
    { key: STEP_KEY.LOCATION, path: POST_ROUTE.location },
    { key: STEP_KEY.TIMELINE, path: POST_ROUTE.timeline },
    { key: STEP_KEY.DETAIL, path: POST_ROUTE.itemDetail },
  ];

const PostCreationStepperLayout = () => {
  const { createPost, isCreatingPost } = useCreatePost();
  const [isCreating, setIsCreating] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const draftImages = usePostCreationStore((state) => state.draftImages);
  const uploadImages = usePostCreationStore((state) => state.uploadImages);
  const analyzeByAI = usePostCreationStore((state) => state.analyzeByAI);
  const getUploadedImageUrls = usePostCreationStore(
    (state) => state.getUploadedImageUrls,
  );
  const addMulti = usePostCreationStore((state) => state.addImages);
  const isPickerSheetVisible = usePostCreationStore(
    (state) => state.isPickerSheetVisible,
  );
  const closePickerSheet = usePostCreationStore(
    (state) => state.closePickerSheet,
  );

  const postType = usePostCreationStore((state) => state.postType);
  const category = usePostCreationStore((state) => state.category);
  const subCategoryCode = usePostCreationStore(
    (state) => state.subCategoryCode,
  );
  const location = usePostCreationStore((state) => state.location);
  const timelineDate = usePostCreationStore((state) => state.timeline.date);

  const resetForm = usePostCreationStore((state) => state.resetForm);

  const electronicDetail = usePostCreationStore(
    (state) => state.electronicDetail,
  );
  const cardDetail = usePostCreationStore((state) => state.cardDetail);
  const personalBelongingDetail = usePostCreationStore(
    (state) => state.personalBelongingDetail,
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const openGallery = async () => {
    closePickerSheet();
    const granted = await ensureMediaPermission();
    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }
    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addMulti(result.assets);
  };

  const takePhoto = async () => {
    closePickerSheet();
    const { status } = await requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("Camera permission is required to take photos.");
      return;
    }
    const result = await launchCameraAsync(CAMERA_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addMulti(result.assets);
  };

  const getAnalyzeResult = usePostCreationStore(
    (state) => state.getAnalyzeResult,
  );

  const isNextDisabled = useMemo(() => {
    if (STEPS[currentStep].key === STEP_KEY.IDENTITY) {
      return draftImages.length === 0;
    }

    if (STEPS[currentStep].key === STEP_KEY.LOCATION) {
      return !location.coords;
    }

    if (STEPS[currentStep].key === STEP_KEY.TIMELINE) {
      return !timelineDate || !eventTimeSchema.isValidSync(timelineDate);
    }

    return false;
  }, [currentStep, timelineDate, draftImages, location]);

  const isLoading = isCreating || isCreatingPost;

  const handleNext = async () => {
    if (STEPS[currentStep].key === STEP_KEY.IDENTITY) {
      uploadImages();
    }

    if (currentStep >= STEPS.length - 1) {
      await handleSubmit();
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

  const handleSubmit = async () => {
    setIsCreating(true);

    try {
      const imageUrls = await getUploadedImageUrls();
      const draftAnalyzeResult = await getAnalyzeResult();

      const title =
        draftAnalyzeResult?.data?.electronic?.itemName ||
        draftAnalyzeResult?.data?.card?.itemName ||
        draftAnalyzeResult?.data?.personalBelonging?.itemName;

      const req: PostCreateRequest = {
        postTitle: title ?? "Untitled Post",
        postType,
        category,
        subcategoryCode: subCategoryCode,
        imageUrls,
        location: location.coords,
        externalPlaceId: location.placeId,
        displayAddress: location.address,
        eventTime: timelineDate ?? new Date(),
        electronicDetail,
        cardDetail,
        personalBelongingDetail,
      };

      const postDetails = await createPost(req);
      const postId = postDetails?.id;

      if (!postId) {
        toast.error("Failed to create post. Please try again.");
        return;
      }

      resetForm();
      router.push(POST_ROUTE.matching(postId));
    } catch (e) {
      console.log("Submit failed", e);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const navigation = useNavigation();

  const handleCancel = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.goBack();
    } else {
      router.back();
    }
    resetForm();
  };

  const handleAIAnalyze = async () => {
    try {
      setIsAnalyzing(true);

      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      const [result] = await Promise.all([analyzeByAI(), minimumDelay]);
      console.log("AI Analyze Result:", result);

      const electronicDetail = result?.data?.electronic;
      const personalBelongingDetail = result?.data?.personalBelonging;

      if (electronicDetail) usePostCreationStore.setState({ electronicDetail });

      const cardDetail = result?.data?.card;
      if (cardDetail) {
        const mappedDetail: CardDetail = {
          itemName: cardDetail.itemName,
          cardNumberHash: cardDetail.cardNumber,
          cardNumberMasked: cardDetail.cardNumber,
          holderName: cardDetail.holderName,
          holderNameNormalized: cardDetail.holderNameNormalized,
          dateOfBirth: cardDetail.dateOfBirth,
          issueDate: cardDetail.issueDate,
          expiryDate: cardDetail.expiryDate,
          issuingAuthority: cardDetail.issuingAuthority,
          ocrText: cardDetail.ocrText,
          aiDescription: cardDetail.aiDescription,
        };

        usePostCreationStore.setState({ cardDetail: mappedDetail });
      }

      if (personalBelongingDetail)
        usePostCreationStore.setState({ personalBelongingDetail });
    } catch (error) {
      console.log("Error during AI analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
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
                headerRight: () => (
                  <AppBackButton onPress={handleCancel} type="xIcon" />
                ),
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
                headerRight: () => (
                  <AppBackButton onPress={handleCancel} type="xIcon" />
                ),
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
                headerRight: () => (
                  <AppBackButton onPress={handleCancel} type="xIcon" />
                ),
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
                headerRight: () => (
                  <AppBackButton onPress={handleCancel} type="xIcon" />
                ),
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
                headerRight: () => (
                  <AppBackButton onPress={handleCancel} type="xIcon" />
                ),
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
                headerRight: () => (
                  <TouchableIconButton
                    icon={<HeadCircuitIcon size={32} />}
                    onPress={handleAIAnalyze}
                    disabled={isAnalyzing}
                  />
                ),
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
            disabled={isNextDisabled}
            style={{ opacity: isNextDisabled ? 0.4 : 1 }}
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

      {isAnalyzing && (
        <View className="absolute inset-0 z-10 items-center justify-center bg-black/10">
          <AppLoader />
        </View>
      )}

      <MenuBottomSheet
        isVisible={isPickerSheetVisible}
        onClose={closePickerSheet}
        options={[
          {
            id: "gallery",
            label: "Open Gallery",
            description: "Pick from your photo library",
            icon: ImageIcon,
            onPress: openGallery,
          },
          {
            id: "camera",
            label: "Take Photo",
            description: "Use your camera",
            icon: CameraIcon,
            onPress: takePhoto,
          },
        ]}
      />
    </>
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
