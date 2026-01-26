import { LocationField } from "@/src/features/map/components";
import type { UserLocation } from "@/src/features/map/types";
import { useAnalyzeImage, useCreatePost } from "@/src/features/post/hooks";
import type { Post, PostCreateRequest } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";
import {
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
import { prepareImageForAnalysis } from "@/src/shared/utils/image.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ImagePickerAsset } from "expo-image-picker";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import { SparkleIcon } from "phosphor-react-native";
import React, { useState } from "react";
import type { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

const postSchema = yup
  .object({
    itemName: yup.string().required("Item name is required"),
    description: yup.string().required("Description is required"),
    eventTime: yup.date().required("Event time is required"),
    images: yup
      .array()
      .of(
        yup
          .mixed<ImagePickerAsset>()
          .defined()
          .test("has-uri", "Invalid image (missing uri).", (asset) => {
            return !!asset && typeof asset === "object" && !!asset.uri;
          })
          .test(
            "mime",
            "Only JPG/PNG/WebP/Heic images are allowed.",
            (asset) => {
              if (!asset) return true;

              const mime = asset.mimeType;
              if (!mime) return true;

              const allowedMimes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/heic",
              ];
              return allowedMimes.includes(mime);
            },
          )
          .test("size", "Image is too large (max 5 MB).", (asset) => {
            if (!asset) return true;

            const size = asset.fileSize;
            if (typeof size !== "number") return true;

            const maxImageSize = 5 * 1024 * 1024; // 5 MB
            return size <= maxImageSize;
          }),
      )
      .min(1, "Please select at least 1 image.")
      .max(5, "You can select up to 5 images.")
      .required("Images are required."),
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
  const [postData, setPostData] = useState<Nullable<Post>>(initialData);
  const { uploadImages, isUploadingImages } = useUploadImage();
  const { createPost, isCreatingPost } = useCreatePost();
  const { analyzeImage, isAnalyzing } = useAnalyzeImage({
    onSuccess: (data) => {
      setValue("itemName", data.itemName);
      setValue("description", data.description);
      toast.success("Image analyzed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to analyze image. Please try again.");
      console.error("Analyze error:", error);
    },
  });

  const loading = isUploadingImages || isCreatingPost || isAnalyzing;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormSchema>({
    defaultValues: {
      itemName: postData?.itemName ?? "",
      description: postData?.description ?? "",
      eventTime: postData?.eventTime ? new Date(postData.eventTime) : undefined,
      detailLocation: postData?.location
        ? {
            location: postData?.location,
            externalPlaceId: postData?.externalPlaceId ?? null,
            displayAddress: postData?.displayAddress ?? null,
          }
        : undefined,
      images: [] as ImagePickerAsset[],
    },
    resolver: yupResolver(postSchema),
    mode: "onSubmit",
  });

  const images = watch("images");

  const handleAnalyzeImage = async () => {
    if (!images || images.length === 0) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const firstImage = images[0];
      const { imageBase64, mimeType } = await prepareImageForAnalysis(
        firstImage.uri,
      );
      await analyzeImage({ imageBase64, mimeType });
    } catch (error) {
      console.error("Error preparing image for analysis:", error);
      toast.error("Failed to prepare image for analysis");
    }
  };

  const handleUploadImages = async (images: ImagePickerAsset[]) => {
    const uploadRes = await uploadImages(images);
    if (!uploadRes) return [];

    const imageUrls = uploadRes.map(
      (res: { downloadURL: string }) => res.downloadURL,
    );
    return imageUrls;
  };

  const onSubmit: SubmitHandler<PostFormSchema> = async (
    data: PostFormSchema,
  ) => {
    try {
      const imageUrls = await handleUploadImages(data.images);
      if (imageUrls.length === 0) {
        toast.error("Failed to upload images. Please try again.");
        return;
      }

      const postCreateRequest: PostCreateRequest = {
        postType,
        itemName: data.itemName,
        description: data.description,
        imageUrls,
        location: data.detailLocation?.location,
        externalPlaceId: data.detailLocation?.externalPlaceId,
        displayAddress: data.detailLocation?.displayAddress,
        distinctiveMarks: null,
        eventTime: data.eventTime,
      };

      const postDetails = await createPost(postCreateRequest);
      setPostData(postDetails);
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

      {/* Loading Modal */}
      <Modal visible={isAnalyzing} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-2xl p-6 mx-8 items-center">
            <AppLoader size={40} />
            <Text className="text-slate-700 font-semibold mt-4 text-center">
              Analyzing image...
            </Text>
            <Text className="text-slate-500 text-sm mt-2 text-center">
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
        {/* Form Fields */}
        <ScrollView
          className="bg-white p-4 border-t border-slate-100 flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Image Picker */}
          <View className="mb-4">
            <Controller
              control={control}
              name="images"
              render={({ field: { onChange, value } }) => (
                <ImageField value={value} onChange={onChange} />
              )}
            />
            {errors.images && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.images.message}
              </Text>
            )}

            {/* Analyze Image Button */}
            {images && images.length > 0 && (
              <TouchableOpacity
                onPress={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <SparkleIcon size={20} color="white" weight="fill" />
                <Text className="text-white font-semibold ml-2">
                  Analyze with AI
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Item Name */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">
              Item Name
            </Text>
            <Controller
              control={control}
              name="itemName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-800 ${errors.itemName ? "border-red-500" : "border-slate-300"}`}
                  placeholder="e.g. Blue Backpack, iPhone 14"
                  placeholderTextColor={colors.slate[300]}
                  value={value}
                  onChangeText={onChange}
                  editable={!loading}
                />
              )}
            />
            {errors.itemName && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.itemName.message}
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-800 min-h-[100px] ${errors.description ? "border-red-500" : "border-slate-300"}`}
                  placeholder="Describe the item in detail."
                  placeholderTextColor={colors.slate[300]}
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!loading}
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </Text>
            )}
          </View>

          {/* Location Picker */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">
              Location
            </Text>

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

          {/* Event Time */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">
              Event Time
            </Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

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
      className="h-12 bg-white px-4"
    />
  );
};
