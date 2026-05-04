import {
  usePlaceAutocomplete,
  usePlaceDetails,
  useReverseGeocoding,
  useUserCoordinates,
} from "@/src/features/map/hooks";
import type { PlacePrediction } from "@/src/features/map/types";
import {
  useAnalyzeImage,
  useGetPostById,
  usePostCreationStore,
  useUpdatePost,
} from "@/src/features/post/hooks";
import { eventTimeSchema } from "@/src/features/post/schemas";
import { usePostSubcategoryStore } from "@/src/features/post/store";
import {
  CardDetail,
  POST_CATEGORIES,
  PostUpdateRequest,
} from "@/src/features/post/types";
import {
  AppBackButton,
  AppButton,
  AppInlineError,
  AppLoader,
  AppSearchRow,
  TouchableIconButton,
} from "@/src/shared/components";
import { MenuBottomSheet } from "@/src/shared/components/ui/MenuBottomSheet";
import { toast } from "@/src/shared/components/ui/toast";
import { ensureMediaPermission } from "@/src/shared/services";
import { AppLocation } from "@/src/shared/store";
import { metrics, typography } from "@/src/shared/theme";
import { colors } from "@/src/shared/theme/colors";
import { Optional } from "@/src/shared/types/global.type";
import { parseToDate } from "@/src/shared/utils/datetime.utils";
import { getErrorMessage } from "@/src/shared/utils/error.utils";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import {
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import {
  CameraIcon,
  GpsFixIcon,
  HeadCircuitIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  XIcon,
} from "phosphor-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import PostDetailForm from "./CategoryForm/PostDetailForm";

const PICKER_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.7,
  allowsMultipleSelection: true,
};

const CAMERA_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"],
  quality: 0.7,
};

const MyPostUpdateScreen = () => {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const insets = useSafeAreaInsets();

  const {
    isLoading,
    data: post,
    error: fetchError,
  } = useGetPostById({ postId });

  console.log("Post:", post);

  const { isLoaded, findSubcategoryById } = usePostSubcategoryStore();
  const { updatePost } = useUpdatePost();
  const { analyzeImage } = useAnalyzeImage();

  const draftImages = usePostCreationStore((s) => s.draftImages);

  const canAnalyze = useMemo(() => {
    if (!post) return false;
    const hasImages = post.imageUrls.length > 0 || draftImages.length > 0;
    return hasImages;
  }, [post, draftImages]);

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const isBackDisabled = isAnalysisLoading || isSaveLoading;
  const isSaveDisabled = isAnalysisLoading || isSaveLoading;
  const isAnalyzeDisabled = !canAnalyze || isAnalysisLoading || isSaveLoading;

  const addImages = usePostCreationStore((s) => s.addImages);
  const removeImage = usePostCreationStore((s) => s.removeImage);
  const uploadImages = usePostCreationStore((s) => s.uploadImages);
  const getUploadedImageUrls = usePostCreationStore(
    (s) => s.getUploadedImageUrls,
  );
  const isPickerSheetVisible = usePostCreationStore(
    (s) => s.isPickerSheetVisible,
  );
  const openPickerSheet = usePostCreationStore((s) => s.openPickerSheet);
  const closePickerSheet = usePostCreationStore((s) => s.closePickerSheet);
  const location = usePostCreationStore((s) => s.location);
  const setLocation = usePostCreationStore((s) => s.setLocation);
  const electronicDetail = usePostCreationStore((s) => s.electronicDetail);
  const cardDetail = usePostCreationStore((s) => s.cardDetail);
  const otherDetail = usePostCreationStore((s) => s.otherDetail);
  const personalBelongingDetail = usePostCreationStore(
    (s) => s.personalBelongingDetail,
  );
  const category = usePostCreationStore((s) => s.category);
  const patchPostTitle = usePostCreationStore((s) => s.updatePostTitle);
  const subCategoryCode = usePostCreationStore((s) => s.subCategoryCode);
  const resetForm = usePostCreationStore((s) => s.resetForm);

  const isPopulated = useRef(false);

  useEffect(() => {
    if (!post || isPopulated.current) return;
    isPopulated.current = true;

    if (post.imageUrls?.length) {
      addImages(
        post.imageUrls.map((uri) => ({
          uri,
          assetId: uri,
          width: 0,
          height: 0,
        })),
      );
    }

    if (post.location) {
      setLocation({
        coords: post.location,
        address: post.displayAddress ?? "",
        placeId: post.externalPlaceId ?? "",
      });
    }

    if (post.category) {
      usePostCreationStore.setState({ category: post.category });
    }

    if (post.electronicDetail) {
      usePostCreationStore.setState({
        electronicDetail: {
          itemName: post.electronicDetail.itemName ?? "",
          brand: post.electronicDetail.brand ?? null,
          model: post.electronicDetail.model ?? null,
          color: post.electronicDetail.color ?? null,
          hasCase: post.electronicDetail.hasCase ?? null,
          caseDescription: post.electronicDetail.caseDescription ?? null,
          screenCondition: post.electronicDetail.screenCondition ?? null,
          lockScreenDescription:
            post.electronicDetail.lockScreenDescription ?? null,
          distinguishingFeatures:
            post.electronicDetail.distinguishingFeatures ?? null,
          aiDescription: post.electronicDetail.aiDescription ?? null,
          additionalDetails: post.electronicDetail.additionalDetails ?? null,
        },
      });
    }
    if (post.cardDetail) {
      const mapped: CardDetail = {
        itemName: post.cardDetail.itemName ?? "",
        cardNumberHash: null,
        cardNumberMasked: post.cardDetail.cardNumberMasked ?? null,
        holderName: post.cardDetail.holderName ?? null,
        holderNameNormalized: null,
        dateOfBirth: post.cardDetail.dateOfBirth
          ? String(post.cardDetail.dateOfBirth)
          : null,
        issueDate: post.cardDetail.issueDate
          ? String(post.cardDetail.issueDate)
          : null,
        expiryDate: post.cardDetail.expiryDate
          ? String(post.cardDetail.expiryDate)
          : null,
        issuingAuthority: post.cardDetail.issuingAuthority ?? null,
        ocrText: null,
        aiDescription: post.cardDetail.aiDescription ?? null,
      };
      usePostCreationStore.setState({ cardDetail: mapped });
    }
    if (post.personalBelongingDetail) {
      usePostCreationStore.setState({
        personalBelongingDetail: {
          itemName: post.personalBelongingDetail.itemName ?? "",
          color: post.personalBelongingDetail.color ?? null,
          brand: post.personalBelongingDetail.brand ?? null,
          material: post.personalBelongingDetail.material ?? null,
          size: post.personalBelongingDetail.size ?? null,
          condition: post.personalBelongingDetail.condition ?? null,
          distinctiveMarks:
            post.personalBelongingDetail.distinctiveMarks ?? null,
          aiDescription: post.personalBelongingDetail.aiDescription ?? null,
          additionalDetails:
            post.personalBelongingDetail.additionalDetails ?? null,
        },
      });
    }
    if (post.otherDetail) {
      usePostCreationStore.setState({
        otherDetail: {
          itemName: post.otherDetail.itemName ?? "",
          primaryColor: post.otherDetail.primaryColor ?? null,
          aiDescription: post.otherDetail.aiDescription ?? null,
          additionalDetails: post.otherDetail.additionalDetails ?? null,
        },
      });
    }
  }, [post]);

  useEffect(() => {
    return () => {
      resetForm();
      isPopulated.current = false;
    };
  }, []);

  const safeSubCategory = useMemo(() => {
    if (!isLoaded || !post) return null;
    return findSubcategoryById(post.subcategoryId);
  }, [post, isLoaded]);

  useEffect(() => {
    if (safeSubCategory) {
      usePostCreationStore.setState({ subCategoryCode: safeSubCategory.code });
    }
  }, [safeSubCategory]);

  const safeDate = useMemo(
    () => parseToDate(post?.eventTime) ?? new Date(),
    [post],
  );
  const [draftDate, setDraftDate] = useState<Date>(safeDate);
  useEffect(() => {
    setDraftDate(safeDate);
  }, [safeDate]);

  const eventTimeError = useMemo(() => {
    if (!draftDate) return "Select the date and time of the incident.";
    try {
      eventTimeSchema.validateSync(draftDate, { abortEarly: true });
      return null;
    } catch (err) {
      return getErrorMessage(err);
    }
  }, [draftDate]);

  const onDateValueChange = useCallback(
    (_event: DateTimePickerEvent, value: Optional<Date>) => {
      if (!value) return;
      setDraftDate(value);
    },
    [],
  );

  const openGallery = async () => {
    closePickerSheet();
    const granted = await ensureMediaPermission();
    if (!granted) {
      toast.error("Media library permission is required to pick photos.");
      return;
    }
    const result = await launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || result.assets.length === 0) return;
    addImages(result.assets);
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
    addImages(result.assets);
  };

  const handleAIAnalyze = async () => {
    try {
      setIsAnalysisLoading(true);

      uploadImages();
      const imageUrls = await getUploadedImageUrls();
      const result = await analyzeImage({
        imageUrls,
        subcategoryCode: subCategoryCode,
      });

      if (result?.electronic)
        usePostCreationStore.setState({ electronicDetail: result.electronic });
      if (result?.personalBelonging)
        usePostCreationStore.setState({
          personalBelongingDetail: result.personalBelonging,
        });
      if (result?.other)
        usePostCreationStore.setState({ otherDetail: result.other });
      if (result?.card) {
        const mapped: CardDetail = {
          itemName: result.card.itemName,
          cardNumberHash: result.card.cardNumber,
          cardNumberMasked: result.card.cardNumber,
          holderName: result.card.holderName,
          holderNameNormalized: result.card.holderNameNormalized,
          dateOfBirth: result.card.dateOfBirth,
          issueDate: result.card.issueDate,
          expiryDate: result.card.expiryDate,
          issuingAuthority: result.card.issuingAuthority,
          ocrText: result.card.ocrText,
          aiDescription: result.card.aiDescription,
        };
        usePostCreationStore.setState({ cardDetail: mapped });
      }

      const titleData =
        category === POST_CATEGORIES.CARD
          ? result?.card?.itemName
          : category === POST_CATEGORIES.ELECTRONICS
            ? result?.electronic?.itemName
            : result?.personalBelonging?.itemName;
      if (titleData) patchPostTitle(titleData);
    } catch {
      toast.error("AI analysis got an error. Please try again.");
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handlePressSave = () => {
    Alert.alert(
      "Confirm Update",
      "Saving these changes will permanently cancel all current handover sessions. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm & Update",
          onPress: async () => {
            await handleSave();
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    if (!postId) {
      toast.error("Invalid post. Please go back and try again.");
      return;
    }
    if (eventTimeError) {
      toast.error(eventTimeError);
      return;
    }
    try {
      setIsSaveLoading(true);

      uploadImages();
      const imageUrls = await getUploadedImageUrls();

      const req: PostUpdateRequest = {
        imageUrls,
        eventTime: draftDate,
        location: location.coords ?? undefined,
        displayAddress: location.address ?? undefined,
        externalPlaceId: location.placeId ?? undefined,
        ...(category === POST_CATEGORIES.ELECTRONICS
          ? { electronicDetail }
          : {}),
        ...(category === POST_CATEGORIES.CARD ? { cardDetail } : {}),
        ...(category === POST_CATEGORIES.PERSONAL_BELONGINGS
          ? { personalBelongingDetail }
          : {}),
        ...(category === POST_CATEGORIES.OTHERS ? { otherDetail } : {}),
      };

      await updatePost({ postId, req });

      setIsSaveLoading(false);

      toast.success("Post updated successfully.");
      router.back();
    } catch {
      toast.error("Failed to update post. Please try again.");
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <AppLoader />
      </SafeAreaView>
    );
  }

  if (fetchError || !post || !safeSubCategory) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <AppInlineError message="Something went wrong. Please try again." />
      </SafeAreaView>
    );
  }

  return (
    <>
      <View className="flex-1 bg-surface">
        <Stack.Screen
          options={{
            headerTitle: "Update Post",
            headerTitleStyle: {
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight
                .normal as TextStyle["fontWeight"],
            },
            headerLeft: () => (
              <AppBackButton
                type="arrowLeftIcon"
                showBackground={false}
                disabled={isBackDisabled}
              />
            ),
            headerRight: () => (
              <TouchableIconButton
                icon={<HeadCircuitIcon size={28} />}
                onPress={handleAIAnalyze}
                disabled={isAnalyzeDisabled}
                loading={isAnalysisLoading}
              />
            ),
          }}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            gap: metrics.spacing.xl,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Images */}
          <View className="gap-sm">
            <Text className="text-lg font-normal text-textPrimary">Photos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {draftImages.map((img, idx) => (
                <View key={img.assetId ?? img.uri} className="relative">
                  <Image
                    source={{ uri: img.uri }}
                    className="w-24 h-24 rounded-md"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => removeImage(idx)}
                    className="absolute top-xs right-xs bg-black/60 rounded-full p-xs"
                  >
                    <XIcon size={12} color="white" weight="bold" />
                  </Pressable>
                </View>
              ))}
              <Pressable
                onPress={openPickerSheet}
                className="w-24 h-24 rounded-md border border-dashed border-divider items-center justify-center"
              >
                <PlusIcon size={24} color={colors.text.muted} />
              </Pressable>
            </ScrollView>
          </View>

          {/* Location */}
          <LocationSection location={location} onChangeLocation={setLocation} />

          {/* Event Time */}
          <View className="gap-sm">
            <Text className="text-lg font-normal text-textPrimary">
              Occurrence Time
            </Text>

            <View className="rounded-primary border border-divider bg-surface p-md gap-md">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-md">
                  <Text className="text-base font-thin text-textPrimary">
                    Time
                  </Text>
                  <Text className="text-sm font-thin text-textMuted italic">
                    When was it last seen?
                  </Text>
                </View>
                <DateTimePicker
                  value={draftDate}
                  mode="time"
                  display="compact"
                  onChange={onDateValueChange}
                  accentColor={colors.secondary}
                />
              </View>
              <View className="border-t border-divider" />
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-md">
                  <Text className="text-base font-thin text-textPrimary">
                    Date
                  </Text>
                  <Text className="text-sm font-thin text-textMuted italic">
                    The day it happened
                  </Text>
                </View>
                <DateTimePicker
                  value={draftDate}
                  onChange={onDateValueChange}
                  mode="date"
                  display="compact"
                  themeVariant="light"
                  accentColor={colors.secondary}
                />
              </View>
            </View>
            {eventTimeError && <AppInlineError message={eventTimeError} />}
          </View>

          {/* Detail Form */}
          <View className="gap-sm">
            <Text className="text-lg font-normal text-textPrimary">
              Item Details
            </Text>
            <PostDetailForm subcategory={safeSubCategory.code} />
          </View>
        </ScrollView>
      </View>

      <View
        className="bg-surface border-t border-divider px-lg pt-md2"
        style={{ paddingBottom: insets.bottom }}
      >
        <AppButton
          title="Update Post"
          onPress={handlePressSave}
          loading={isSaveLoading}
          disabled={isSaveDisabled}
        />
      </View>

      {isAnalysisLoading && (
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

export default MyPostUpdateScreen;

type LocationSectionProps = {
  location: AppLocation;
  onChangeLocation: (loc: AppLocation) => void;
};

const LocationSection = ({
  location,
  onChangeLocation,
}: LocationSectionProps) => {
  const inputRef = useRef<TextInput>(null);
  const mapRef = useRef<MapView>(null);

  const { getPlaceDetails } = usePlaceDetails();
  const { reverseGeocode } = useReverseGeocoding();
  const { getUserCoordinates, loading } = useUserCoordinates();

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(location.address ?? "");

  const { predictions } = usePlaceAutocomplete({ searchQuery: query });

  const mapRegion = useMemo<Region>(
    () => ({
      latitude: location.coords?.latitude ?? 10.7769,
      longitude: location.coords?.longitude ?? 106.7009,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [location.coords],
  );

  useEffect(() => {
    mapRef.current?.animateToRegion(mapRegion, 300);
  }, [mapRegion]);

  const handleFocus = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const handleSelectSuggestion = useCallback(
    async (prediction: PlacePrediction) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        const placeDetail = await getPlaceDetails({
          placeId: prediction.placeId,
        });
        onChangeLocation({
          coords: placeDetail.location,
          address: placeDetail.formattedAddress,
          placeId: prediction.placeId,
        });
        setQuery(placeDetail.formattedAddress);
        handleBlur();
      } catch {
        console.log("Error fetching place details");
      }
    },
    [getPlaceDetails, onChangeLocation],
  );

  const handleNearby = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (loading) return;
    try {
      const coords = await getUserCoordinates();
      if (!coords) return;
      const result = await reverseGeocode({ location: coords });
      onChangeLocation({
        coords,
        address: result.formattedAddress,
        placeId: result.placeId,
      });
      setQuery(result.formattedAddress);
      handleBlur();
    } catch {
      console.log("Error fetching user coordinates");
    }
  }, [getUserCoordinates, loading, reverseGeocode, onChangeLocation]);

  const showSuggestions = isFocused && query.length > 0;

  return (
    <View className="gap-sm">
      <Text className="text-lg font-normal text-textPrimary">Location</Text>
      <View className="rounded-md overflow-hidden">
        <MapView
          ref={mapRef}
          style={{ height: 300 }}
          initialRegion={mapRegion}
          onPress={handleBlur}
        >
          {location.coords && <Marker coordinate={location.coords} />}
        </MapView>

        {/* Search overlay */}
        <View className="absolute left-sm right-sm top-md">
          <View
            className="rounded-md bg-surface"
            style={{
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <View className="gap-xs">
              {/* Search Input */}
              <View
                className="flex-row items-center rounded-md p-sm"
                style={{
                  borderWidth: isFocused ? 1 : 0,
                  borderColor: isFocused ? colors.secondary : colors.muted,
                }}
              >
                <View className="p-sm">
                  <MagnifyingGlassIcon
                    size={14}
                    weight="bold"
                    color={colors.secondary}
                  />
                </View>
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Search area or landmark"
                  className="flex-1 font-thin text-textPrimary text-sm"
                  returnKeyType="search"
                  placeholderTextColor={colors.text.muted}
                  cursorColor={colors.black}
                  selectionColor={colors.black}
                  numberOfLines={1}
                />
                <View className="p-sm">
                  <Pressable
                    onPress={handleNearby}
                    disabled={loading}
                    style={{ opacity: loading ? 0.4 : 1 }}
                  >
                    <GpsFixIcon
                      size={20}
                      color={colors.primary}
                      weight="duotone"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Suggestions */}
              {showSuggestions && (
                <MotiView
                  from={{ opacity: 0, translateY: 4 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 300 }}
                >
                  {predictions.length === 0 ? (
                    <View className="px-md pb-xs">
                      <Text className="text-sm text-textMuted">
                        No matches found.
                      </Text>
                    </View>
                  ) : (
                    <View className="flex-col px-sm gap-xs mb-xs">
                      {predictions.map((item) => (
                        <AppSearchRow
                          key={`update-location-${item.placeId}`}
                          IconComponent={MapPinIcon}
                          text={item.formattedAddress}
                          onPress={() => void handleSelectSuggestion(item)}
                        />
                      ))}
                    </View>
                  )}
                </MotiView>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
