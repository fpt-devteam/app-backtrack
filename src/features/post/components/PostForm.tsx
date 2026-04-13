import { LocationField } from "@/src/features/map/components";
import { DEFAULT_RADIUS_KM } from "@/src/features/map/constants";
import type { UserLocation } from "@/src/features/map/types";
import { useAnalyzeImage, useCreatePost } from "@/src/features/post/hooks";
import {
  AnalyzeImageData,
  ITEM_CATEGORIES,
  PostType,
  type ItemCategory,
  type Post,
  type PostCreateRequest,
} from "@/src/features/post/types";
import {
  AppAccordion,
  AppChipsRow,
  AppHeader,
  AppLoader,
  CloseButton,
  DateTimePickerField,
  HeaderTitle,
  ImageField,
  TextButton,
} from "@/src/shared/components";
import { toast } from "@/src/shared/components/ui/toast";
import { POST_ROUTE } from "@/src/shared/constants";
import { useUploadImage } from "@/src/shared/hooks";
import { colors } from "@/src/shared/theme/colors";
import type { Nullable } from "@/src/shared/types";
import { toTitleCase } from "@/src/shared/utils/string.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ImagePickerAsset } from "expo-image-picker";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import { CaretDownIcon, CaretUpIcon } from "phosphor-react-native";
import React, { useState } from "react";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as yup from "yup";

const imageValidation = yup
  .mixed<ImagePickerAsset>()
  .defined()
  .test("has-uri", "Invalid image (missing uri).", (asset) => {
    return !!asset && typeof asset === "object" && !!asset.uri;
  })
  .test("mime", "Only JPG/PNG/WebP/Heic images are allowed.", (asset) => {
    if (!asset) return true;
    const mime = asset.mimeType;
    if (!mime) return true;
    return ["image/jpeg", "image/png", "image/webp", "image/heic"].includes(
      mime,
    );
  })
  .test("size", "Image is too large (max 5 MB).", (asset) => {
    if (!asset) return true;
    const size = asset.fileSize;
    if (typeof size !== "number") return true;
    return size <= 5 * 1024 * 1024;
  });

const postSchema = yup
  .object({
    item: yup.mixed<AnalyzeImageData>().required(),
    images: yup
      .array()
      .of(imageValidation)
      .min(1, "Please select at least 1 image.")
      .max(5, "You can select up to 5 images.")
      .required("Images are required."),
    eventTime: yup.date().required("Event time is required"),
    detailLocation: yup.mixed<UserLocation>().required("Location is required"),
  })
  .required();

type PostFormSchema = yup.InferType<typeof postSchema>;

type PostFormProps = {
  postType: PostType;
  mode: "create" | "edit";
  initialData: Nullable<Post>;
};

export const PostForm = ({ postType, initialData }: PostFormProps) => {
  const [postData] = useState<Nullable<Post>>(initialData);
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false);

  const { uploadImages, isUploadingImages } = useUploadImage();
  const { createPost, isCreatingPost } = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormSchema>({
    defaultValues: {
      item: {
        itemName: postData?.item?.itemName ?? "",
        category: postData?.item?.category ?? undefined,
        color: postData?.item?.color ?? null,
        brand: postData?.item?.brand ?? null,
        condition: postData?.item?.condition ?? null,
        material: postData?.item?.material ?? null,
        distinctiveMarks: postData?.item?.distinctiveMarks ?? null,
      },
      images: [] as ImagePickerAsset[],
      eventTime: postData?.eventTime ? new Date(postData.eventTime) : undefined,
      detailLocation: postData?.location
        ? {
            location: postData.location,
            externalPlaceId: postData.externalPlaceId ?? null,
            displayAddress: postData.displayAddress ?? null,
            radiusInKm: DEFAULT_RADIUS_KM,
          }
        : undefined,
    },
    resolver: yupResolver(postSchema),
    mode: "onSubmit",
  });

  const selectedCategory = watch("item.category");

  const { analyzeImage, isAnalyzing } = useAnalyzeImage({
    onSuccess: (data) => {
      setValue("item.itemName", data.itemName);
      setValue("item.category", data.category);
      setValue("item.color", data.color);
      setValue("item.brand", data.brand);
      setValue("item.condition", data.condition);
      setValue("item.material", data.material);
      toast.success("Image analyzed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to analyze image. Please try again.");
      console.error("Analyze error:", error);
    },
  });

  const loading = isUploadingImages || isCreatingPost || isAnalyzing;

  const handleUploadImages = async (
    picked: ImagePickerAsset[],
  ): Promise<string[]> => {
    const uploadRes = await uploadImages(picked);
    if (!uploadRes) return [];
    return uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
  };

  const onSubmit: SubmitHandler<PostFormSchema> = async (data) => {
    try {
      const imageUrls = await handleUploadImages(data.images);
      if (imageUrls.length === 0) {
        toast.error("Failed to upload images. Please try again.");
        return;
      }

      const postCreateRequest: PostCreateRequest = {
        postType,
        item: {
          itemName: data.item.itemName,
          category: data.item.category as ItemCategory,
          color: data.item.color ?? null,
          brand: data.item.brand ?? null,
          condition: data.item.condition ?? null,
          material: data.item.material ?? null,
          distinctiveMarks: data.item.distinctiveMarks ?? null,
          additionalDetails: null,
          size: null,
        },
        imageUrls,
        eventTime: data.eventTime,
        location: data.detailLocation.location,
        displayAddress: data.detailLocation.displayAddress ?? null,
        externalPlaceId: data.detailLocation.externalPlaceId ?? null,
        radiusInKm: DEFAULT_RADIUS_KM,
      };

      const postDetails = await createPost(postCreateRequest);
      const postId = postDetails?.id;
      if (!postId) {
        toast.error("Failed to create post. Please try again.");
        return;
      }
      router.push(
        POST_ROUTE.matching(postId) as RelativePathString | ExternalPathString,
      );
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit post. Please try again.");
    }
  };

  return (
    <View className="flex-1">
      <PostFormHeader
        title={postType === PostType.Found ? "Add Found Item" : "Add Lost Item"}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        disabled={loading}
        isSubmitting={isCreatingPost}
      />

      {/* AI Analyzing Modal */}
      <Modal visible={isAnalyzing } transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-surface rounded-2xl p-6 mx-8 items-center">
            <AppLoader dotSize={8} />
            <Text className="text-slate-700 font-semibold mt-4 text-center">
              Analyzing image...
            </Text>
            <Text className="text-textSecondary text-sm mt-2 text-center">
              AI is identifying the item
            </Text>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={40}
        className="flex-1"
      >
        <ScrollView
          className="bg-surface p-4 border-t border-divider flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Images ─────────────────────────────────────────────── */}
          <View className="mb-4">
            <Controller
              control={control}
              name="images"
              render={({ field: { onChange, value } }) => (
                <ImageField
                  value={value}
                  onChange={async (value: ImagePickerAsset[]) => {
                    const imageUrls = await handleUploadImages(value);
                    const firstImage = imageUrls[0];

                    await analyzeImage({ imageUrl: firstImage }).catch(
                      () => undefined,
                    );

                    onChange(value);
                  }}
                />
              )}
            />
            {errors.images && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.images.message}
              </Text>
            )}
          </View>

          {/* ── Item Name ──────────────────────────────────────────── */}
          <View className="mb-4">
            <FieldLabel label="Item Name" />
            <Controller
              control={control}
              name="item.itemName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-xl px-3 py-2.5 text-sm bg-canvas text-textPrimary ${errors.item?.itemName ? "border-red-500" : "border-divider"}`}
                  placeholder="e.g. Blue Backpack, iPhone 14"
                  placeholderTextColor={colors.slate[300]}
                  value={value}
                  onChangeText={onChange}
                  editable={!loading}
                />
              )}
            />
            {errors.item?.itemName && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.item.itemName.message}
              </Text>
            )}
          </View>

          {/* ── Category ───────────────────────────────────────────── */}
          <View className="mb-4">
            <FieldLabel label="Category" />
            <Controller
              control={control}
              name="item.category"
              render={({ field: { onChange } }) => (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 2 }}
                >
                  <AppChipsRow
                    chips={Object.values(ITEM_CATEGORIES).map((cat) => ({
                      label: toTitleCase(cat),
                      selected: selectedCategory === cat,
                      onPress: () => onChange(cat),
                      disabled: loading,
                    }))}
                  />
                </ScrollView>
              )}
            />
            {errors.item?.category && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.item.category.message}
              </Text>
            )}
          </View>

          {/* ── Location ───────────────────────────────────────────── */}
          <View className="mb-4">
            <Controller
              control={control}
              name="detailLocation"
              render={({ field: { onChange, value } }) => (
                <LocationField value={value} onChange={onChange} />
              )}
            />
            {errors.detailLocation && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.detailLocation.message}
              </Text>
            )}
          </View>

          {/* ── Event Time ─────────────────────────────────────────── */}
          <View className="mb-4">
            <FieldLabel label="Event Time" />
            <Controller
              control={control}
              name="eventTime"
              render={({ field: { onChange, value } }) => (
                <DateTimePickerField
                  value={value}
                  onChange={onChange}
                  placeholder="Select event date and time"
                  disabled={loading}
                />
              )}
            />
            {errors.eventTime && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.eventTime.message}
              </Text>
            )}
          </View>

          {/* ── More Details (optional) ─────────────────────────────── */}
          <View className="mb-6">
            <AppAccordion
              isExpanded={moreDetailsOpen}
              onToggle={() => setMoreDetailsOpen((v) => !v)}
              collapsedContent={
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-sm font-semibold text-textPrimary">
                    More details{" "}
                    <Text className="font-normal text-textMuted">
                      (optional)
                    </Text>
                  </Text>
                  {moreDetailsOpen ? (
                    <CaretUpIcon size={16} color={colors.slate[500]} />
                  ) : (
                    <CaretDownIcon size={16} color={colors.slate[500]} />
                  )}
                </View>
              }
              expandedContent={
                <View className="pt-2 gap-y-4">
                  <OptionalTextInput
                    control={control}
                    name="item.color"
                    label="Color"
                    placeholder="e.g. Black, Navy Blue"
                    loading={loading}
                  />
                  <OptionalTextInput
                    control={control}
                    name="item.brand"
                    label="Brand"
                    placeholder="e.g. Apple, Samsung, Nike"
                    loading={loading}
                  />
                  <OptionalTextInput
                    control={control}
                    name="item.condition"
                    label="Condition"
                    placeholder="e.g. New, Used, Scratched"
                    loading={loading}
                  />
                  <OptionalTextInput
                    control={control}
                    name="item.material"
                    label="Material"
                    placeholder="e.g. Leather, Plastic, Metal"
                    loading={loading}
                  />
                  <OptionalTextInput
                    control={control}
                    name="item.distinctiveMarks"
                    label="Distinctive Marks"
                    placeholder="e.g. Scratched corner, sticker on back"
                    loading={loading}
                  />
                </View>
              }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-slate-700 font-bold text-sm mb-2">{label}</Text>
);

type OptionalTextInputProps = {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  loading: boolean;
  multiline?: boolean;
};

const OptionalTextInput = ({
  control,
  name,
  label,
  placeholder,
  loading,
  multiline = false,
}: OptionalTextInputProps) => (
  <View>
    <FieldLabel label={label} />
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          className={`border border-divider rounded-xl px-3 py-2.5 text-sm bg-canvas text-textPrimary${multiline ? " min-h-[80px]" : ""}`}
          placeholder={placeholder}
          placeholderTextColor={colors.slate[300]}
          value={value ?? ""}
          onChangeText={(text) => onChange(text.trim() === "" ? null : text)}
          editable={!loading}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? "top" : "center"}
        />
      )}
    />
  </View>
);

const PostFormHeader = ({
  title,
  handleSubmit,
  onSubmit,
  disabled,
  isSubmitting,
}: {
  title: string;
  handleSubmit: UseFormHandleSubmit<PostFormSchema>;
  onSubmit: SubmitHandler<PostFormSchema>;
  disabled: boolean;
  isSubmitting: boolean;
}) => {
  return (
    <AppHeader
      left={<CloseButton />}
      center={<HeaderTitle title={title} className="items-center" />}
      right={
        <TextButton
          label="Submit"
          disabled={disabled}
          isSubmitting={isSubmitting}
          onPress={handleSubmit(onSubmit, (errs) => {
            console.log("FORM INVALID:", errs);
            toast.error("Form invalid", "please check required fields");
          })}
        />
      }
      className="h-12 bg-surface px-4"
    />
  );
};
