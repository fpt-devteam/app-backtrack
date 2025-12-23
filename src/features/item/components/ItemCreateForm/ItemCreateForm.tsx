import ImagePickerSection from "@/src/shared/components/ImagePickerSection/ImagePickerSection";
import { useUploadImage } from "@/src/shared/hooks/useUploadImage";
import { ImageAsset } from "@/src/shared/types/firebase.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from 'react';
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
  })
  .required();

type ItemSchema = yup.InferType<typeof qrSchema>;

const ItemLinkForm = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const { uploadImages } = useUploadImage();
  const { linkItemToQr } = useLinkQrItem();

  const pickImages = (pickedImages: ImageAsset[]) => {
    setImages(pickedImages);
  };

  const handleUploadImages = async () => {
    const uploadRes = await uploadImages(images);
    if (!uploadRes) return null;

    const imageUrls = uploadRes.map((res) => res.downloadURL);
    return imageUrls;
  }

  const { control, handleSubmit, formState: { errors },
  } = useForm<ItemSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(qrSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ItemSchema> = async (data: ItemSchema) => {
    const imageUrls = await handleUploadImages();
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
        <ImagePickerSection images={images} pickImages={pickImages} />

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