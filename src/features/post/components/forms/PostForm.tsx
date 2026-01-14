import { LocationField } from "@/src/features/location/components";
import type { UserLocation } from "@/src/features/location/types";
import { useCreatePost } from "@/src/features/post/hooks";
import type { Post, PostCreateRequest } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";
import { DateTimePickerField, ImageField } from "@/src/shared/components";
import { AppHeader } from "@/src/shared/components/app-utils";
import { DefaultTopRightActionButton } from "@/src/shared/components/app-utils/AppHeader";
import { POST_ROUTE } from "@/src/shared/constants";
import { useUploadImage } from "@/src/shared/hooks";
import colors from "@/src/shared/theme/colors";
import type { Nullable } from "@/src/shared/types";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ImagePickerAsset } from "expo-image-picker";
import type { ExternalPathString, RelativePathString } from "expo-router";
import { router } from "expo-router";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";

const postSchema = yup
  .object({
    itemName: yup.string().required("Item name is required"),
    description: yup.string().required("Description is required"),
    eventTime: yup.date().required("Event time is required"),
    distinctiveMarks: yup.string().required("Distinctive marks is required"),
    images: yup
      .array()
      .of(
        yup
          .mixed<ImagePickerAsset>().defined()
          .test("has-uri", "Invalid image (missing uri).", (asset) => {
            return !!asset && typeof asset === "object" && !!asset.uri;
          })
          .test("mime", "Only JPG/PNG/WebP images are allowed.", (asset) => {
            if (!asset) return true;

            const mime = asset.mimeType;
            if (!mime) return true;

            const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
            return allowedMimes.includes(mime);
          })
          .test("size", "Image is too large (max 5 MB).", (asset) => {
            if (!asset) return true;

            const size = asset.fileSize;
            if (typeof size !== "number") return true;

            const maxImageSize = 5 * 1024 * 1024; // 5 MB
            return size <= maxImageSize;
          })
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

const PostForm = ({ postType, mode, initialData }: PostFormProps) => {
  const [postData, setPostData] = useState<Nullable<Post>>(initialData);
  const { uploadImages, isUploadingImages } = useUploadImage();
  const { createPost, isCreatingPost } = useCreatePost();
  const insets = useSafeAreaInsets();

  const loading = isUploadingImages || isCreatingPost;

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<PostFormSchema>({
    defaultValues: {
      itemName: postData?.itemName ?? "",
      description: postData?.description ?? "",
      distinctiveMarks: postData?.distinctiveMarks ?? "",
      eventTime: postData?.eventTime ? new Date(postData.eventTime) : undefined,
      detailLocation: postData?.location ? {
        location: postData?.location,
        externalPlaceId: postData?.externalPlaceId ?? null,
        displayAddress: postData?.displayAddress ?? null,
      } : undefined,
      images: [] as ImagePickerAsset[],
    },
    resolver: yupResolver(postSchema),
    mode: "onSubmit",
  });

  const handleUploadImages = async (images: ImagePickerAsset[]) => {
    const uploadRes = await uploadImages(images);
    if (!uploadRes) return [];

    const imageUrls = uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
    return imageUrls;
  };

  const onSubmit: SubmitHandler<PostFormSchema> = async (data: PostFormSchema) => {
    try {
      const imageUrls = await handleUploadImages(data.images);
      if (imageUrls.length === 0) {
        Alert.alert("Error", "Failed to upload images.");
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
        distinctiveMarks: data.distinctiveMarks,
        eventTime: data.eventTime,
      };

      console.log("Post data to submit:", postCreateRequest);
      const postDetails = await createPost(postCreateRequest);
      setPostData(postDetails);

      console.log("Post created successfully:", postDetails);

      const postId = postDetails?.id;
      if (!postId) {
        Alert.alert("Error", "Failed to create post. Please try again.");
        return;
      }

      router.push(POST_ROUTE.matching(postId) as RelativePathString | ExternalPathString);
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit post. Please try again.");
    }
  };

  const headerTitle = postType === PostType.Found ? "Add Found Item" : "Add Lost Item";

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <AppHeader
        title={headerTitle}
        rightActionButton={
          <DefaultTopRightActionButton
            lable={mode === 'edit' ? 'Save' : 'Upload'}
            onPress={handleSubmit(onSubmit)}
            disabled={isCreatingPost || isUploadingImages}
            isSubmitting={isCreatingPost || isUploadingImages}
          />
        }
      />

      <ScrollView className="flex-1 p-4">
        {/* Form Fields */}
        <View className="bg-white rounded-3xl p-4 my-3 shadow-md border border-slate-300">

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
              <Text className="text-red-500 text-xs mt-1">{errors.images.message}</Text>
            )}
          </View>

          {/* Item Name */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">Item Name</Text>
            <Controller
              control={control}
              name="itemName"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-sm px-3 py-2.5 text-sm bg-slate-50 text-slate-800 ${errors.itemName ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="e.g. Blue Backpack, iPhone 14"
                  placeholderTextColor={colors.slate[300]}
                  value={value}
                  onChangeText={onChange}
                  editable={!loading}
                />
              )}
            />
            {errors.itemName && (
              <Text className="text-red-500 text-xs mt-1">{errors.itemName.message}</Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-sm px-3 py-2.5 text-sm bg-slate-50 text-slate-800 min-h-[100px] ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
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
              <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
            )}
          </View>

          {/* Distinctive Marks */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">Distinctive Marks</Text>
            <Controller
              control={control}
              name="distinctiveMarks"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-sm px-3 py-2.5 text-sm bg-slate-50 text-slate-800 min-h-[100px] ${errors.distinctiveMarks ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="Any unique marks, scratches, or identifying features (optional)"
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
            {errors.distinctiveMarks && (
              <Text className="text-red-500 text-xs mt-1">{errors.distinctiveMarks.message}</Text>
            )}
          </View>

          {/* Location Picker */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">Location</Text>

            <Controller
              control={control}
              name="detailLocation"
              render={({ field: { onChange, value } }) => (
                <LocationField
                  value={value}
                  onChange={onChange} />
              )}
            />
            {errors.detailLocation && (
              <Text className="text-red-500 text-xs mt-1">{errors.detailLocation.message}</Text>
            )}
          </View>

          {/* Event Time */}
          <View className="mb-4">
            <Text className="text-slate-700 font-bold text-sm mb-2">Event Time</Text>
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
              <Text className="text-red-500 text-xs mt-1">{errors.eventTime.message}</Text>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default PostForm;
