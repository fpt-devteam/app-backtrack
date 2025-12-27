
import { DateTimePickerField, ImageField, LocationField } from "@/src/shared/components";
import { useUploadImage } from "@/src/shared/hooks";
import { GoogleMapDetailLocation, Nullable } from "@/src/shared/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Button, FlatList, TextInput, View } from "react-native";
import { Text } from "react-native-paper";
import * as yup from "yup";
import { useCreatePost } from "../../hooks";
import { Post, PostCreateRequest, PostType } from "../../types";
import { styles } from "./styles";

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
    detailLocation: yup.mixed<GoogleMapDetailLocation>().required("Location is required"),
  })
  .required();

type PostFoundFormSchema = yup.InferType<typeof postSchema>;

type PostFoundFormProps = {
  mode: 'create' | 'edit',
  initialData: Nullable<Post>;
};

export const PostFoundForm = ({ mode, initialData }: PostFoundFormProps) => {
  const [postData, setPostData] = useState<Nullable<Post>>(initialData);
  const { uploadImages } = useUploadImage();
  const { createPost } = useCreatePost();

  const { control, handleSubmit, formState: { errors }, } = useForm<PostFoundFormSchema>({
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

  const onSubmit: SubmitHandler<PostFoundFormSchema> = async (data: PostFoundFormSchema) => {
    try {
      const imageUrls = await handleUploadImages(data.images);
      if (imageUrls.length === 0) {
        Alert.alert("Error", "Failed to upload images.");
        return;
      }

      const postCreateRequest: PostCreateRequest = {
        postType: PostType.Found,
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

      router.push({
        pathname: '/(protected)/(posts)/matching',
        params: { postId: postDetails?.id }
      });
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit post. Please try again.");
    }
  };

  const content = (<View style={styles.container}>
    {/* Form Fields */}
    <View style={styles.formSection}>
      {/* Image Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Photos of the item</Text>
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, onBlur, value } }) => (
            <ImageField value={value} onChange={onChange} />
          )}
        />
        {errors.images && (<Text style={styles.errorText}>{errors.images.message}</Text>)}
      </View>

      <Text style={styles.sectionTitle}>Item Details</Text>
      {/* Item Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Item Name</Text>
        <Controller
          control={control}
          name="itemName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.itemName && styles.inputError]}
              placeholder="e.g. Blue Backpack, iPhone 14"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.itemName && <Text style={styles.errorText}>{errors.itemName.message}</Text>}
      </View>

      {/* Description */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Describe the item in detail."
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
      </View>

      {/* Distinctive Marks */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Distinctive Marks</Text>
        <Controller
          control={control}
          name="distinctiveMarks"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textArea, errors.distinctiveMarks && styles.inputError]}
              placeholder="Any unique marks, scratches, or identifying features (optional)"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.distinctiveMarks && (
          <Text style={styles.errorText}>{errors.distinctiveMarks.message}</Text>
        )}
      </View>

      {/* Event Time */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Event Time</Text>
        <Controller
          control={control}
          name="eventTime"
          render={({ field: { onChange, value } }) => (
            <DateTimePickerField
              value={value}
              onChange={onChange}
              placeholder="Select event date and time"
            />
          )}
        />
        {errors.eventTime && (<Text style={styles.errorText}>{errors.eventTime.message}</Text>)}
      </View>

      {/* Location Picker */}
      <View style={styles.fieldContainer}>
        <Controller
          control={control}
          name="detailLocation"
          render={({ field: { onChange, value } }) => (
            <LocationField value={value} onChange={onChange} />
          )}
        />
        {errors.detailLocation && (<Text style={styles.errorText}>{errors.detailLocation.message}</Text>)}
      </View>
    </View>

    {/* Submit Button */}
    <View style={styles.buttonContainer}>
      <Button title="Submit Report" onPress={handleSubmit(onSubmit)} />
    </View>
  </View>)
  return (
    <FlatList
      data={[{ key: "form" }]}
      keyExtractor={(i) => i.key}
      renderItem={() => null}
      ListHeaderComponent={content}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  )
}
