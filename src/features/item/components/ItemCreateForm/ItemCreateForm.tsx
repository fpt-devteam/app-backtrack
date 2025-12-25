import ImageField from "@/src/shared/components/ImageField/ImageField";
import { useUploadImage } from "@/src/shared/hooks/useUploadImage";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import React from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from "yup";
import { API_ITEM_ACTIVATED } from "../../constant/item.constant";
import useLinkQrItem from "../../hooks/useLinkQrItem";
import { ItemCreateRequest } from "../../types/item.type";
import { styles } from "./styles";

const qrSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
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
  })
  .required();

type ItemSchema = yup.InferType<typeof qrSchema>;

const ItemLinkForm = () => {
  const { uploadImages } = useUploadImage();
  const { linkItemToQr } = useLinkQrItem();

  const handleUploadImages = async (images: ImagePickerAsset[]) => {
    const uploadRes = await uploadImages(images);
    if (!uploadRes) return [];

    const imageUrls = uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
    return imageUrls;
  };

  const { control, handleSubmit, formState: { errors },
  } = useForm<ItemSchema>({
    defaultValues: {
      name: "",
      description: "",
      images: [] as ImagePickerAsset[],
    },
    resolver: yupResolver(qrSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ItemSchema> = async (data: ItemSchema) => {
    const imageUrls = await handleUploadImages(data.images);
    if (!imageUrls) {
      Alert.alert("Error", "Failed to upload images.");
      return;
    }

    const itemCreateRequest: ItemCreateRequest = {
      name: data.name,
      description: data.description,
      imageUrls: imageUrls,
    };

    const response = await linkItemToQr(itemCreateRequest);
    if (response) {
      const publicCode = response.qrCode.publicCode;
      router.push({
        pathname: API_ITEM_ACTIVATED,
        params: { publicCode: String(publicCode) },
      });
    }
    else {
      Alert.alert("Error", "Failed to link item to QR code.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create QR Code for Item</Text>

        {/* Image Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Photos of the Item *</Text>
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, onBlur, value } }) => (
              <ImageField value={value} onChange={onChange} />
            )}
          />
          {errors.images && (<Text style={styles.errorText}>{errors.images.message}</Text>)}
        </View>

        {/* Item Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Item Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter item name"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description *</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter description"
                multiline
                numberOfLines={4}
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>Activate & Protected Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ItemLinkForm                                                           