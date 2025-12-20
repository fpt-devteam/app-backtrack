import { useUploadImage } from '@/src/hooks/useUploadImage';
import { ImageAsset } from '@/src/types/firebase.type';
import { GoogleMapFormattedLocation } from '@/src/types/location.type';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import * as yup from "yup";
import ImagePickerSection from '../ImagePickerSection';
import LocationPicker from '../LocationPicker/LocationPicker';
import { styles } from './styles';

const reportSchema = yup
  .object({
    postType: yup.string().required("Post type is required"),
    itemName: yup.string().required("Item name is required"),
    description: yup.string().required("Description is required"),
    eventTime: yup.date().required("Event time is required"),
    materials: yup.string().nullable().defined(),
    brands: yup.string().nullable().defined(),
    colors: yup.string().nullable().defined(),
  })
  .required();

type ReportFormSchema = yup.InferType<typeof reportSchema>;

const ReportForm = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [location, setLocation] = useState<GoogleMapFormattedLocation | null>(null);

  const { uploadImages } = useUploadImage();

  const { control, handleSubmit, reset: resetForm, formState: { errors } } = useForm<ReportFormSchema>({
    defaultValues: {
      postType: "",
      itemName: "",
      description: "",
      materials: "",
      brands: "",
      colors: "",
      eventTime: new Date(),
    },
    resolver: yupResolver(reportSchema),
    mode: "onSubmit",
  });

  const pickImages = (newImages: ImageAsset[]) => {
    setImages([...images, ...newImages]);
  }

  const changeLocation = (newLocation: GoogleMapFormattedLocation | null) => {
    setLocation(newLocation);
    console.log("Location changed: ", newLocation);
  };

  const reset = () => {
    setImages([]);
    setLocation(null);
    resetForm();
  }

  const validateForm = (): boolean => {
    if (images.length === 0) {
      Alert.alert("Validation Error", "Please pick at least one image.");
      return false;
    }
    if (!location) {
      Alert.alert("Validation Error", "Please select a location.");
      return false;
    }
    return true;
  };

  const handleUploadImages = async (): Promise<string[]> => {
    console.log('Images: ', images);
    const uploadRes = await uploadImages(images);
    console.log(uploadRes);

    const imageUrls = uploadRes.map(res => res.downloadURL);
    console.log('Image URLs: ', imageUrls);

    return imageUrls;
  }

  const onSubmit: SubmitHandler<ReportFormSchema> = async (data) => {
    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    try {
      // Upload images
      const imageUrls = await handleUploadImages();
      if (imageUrls.length === 0) {
        Alert.alert("Error", "Failed to upload images.");
        return;
      }

      // Parse comma-separated strings to arrays
      const materialsArray = data.materials ? data.materials.split(',').map(s => s.trim()).filter(Boolean) : null;
      const brandsArray = data.brands ? data.brands.split(',').map(s => s.trim()).filter(Boolean) : null;
      const colorsArray = data.colors ? data.colors.split(',').map(s => s.trim()).filter(Boolean) : null;

      const reportData = {
        postType: data.postType,
        itemName: data.itemName,
        description: data.description,
        materials: materialsArray,
        brands: brandsArray,
        colors: colorsArray,
        imageUrls: imageUrls,
        location: location!,
        eventTime: data.eventTime,
      };

      console.log("Report data to submit:", reportData);
      Alert.alert("Success", "Report submitted successfully!");
      reset();
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <ImagePickerSection
          images={images}
          pickImages={pickImages}
        />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Item Details</Text>

          {/* Post Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Post Type*</Text>
            <Controller
              control={control}
              name="postType"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.postType && styles.inputError]}
                  placeholder="e.g., Lost or Found"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.postType && <Text style={styles.errorText}>{errors.postType.message}</Text>}
          </View>

          {/* Item Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Item Name*</Text>
            <Controller
              control={control}
              name="itemName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.itemName && styles.inputError]}
                  placeholder="e.g., Blue Backpack, iPhone 14"
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
            <Text style={styles.label}>Description*</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textArea, errors.description && styles.inputError]}
                  placeholder="Describe the item in detail..."
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
          </View>

          {/* Materials */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Materials</Text>
            <Controller
              control={control}
              name="materials"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Leather, Cotton (comma-separated)"
                  value={value || ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Brands */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Brands</Text>
            <Controller
              control={control}
              name="brands"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Nike, Apple (comma-separated)"
                  value={value || ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Colors */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Colors</Text>
            <Controller
              control={control}
              name="colors"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Blue, Red (comma-separated)"
                  value={value || ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          {/* Event Time */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Event Time*</Text>
            <Controller
              control={control}
              name="eventTime"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.eventTime && styles.inputError]}
                  placeholder="ISO format or date"
                  value={value ? value.toISOString() : ""}
                  onChangeText={(text) => {
                    try {
                      const date = new Date(text);
                      if (!Number.isNaN(date.getTime())) {
                        onChange(date);
                      }
                    } catch {
                      // Invalid date, ignore
                    }
                  }}
                />
              )}
            />
            {errors.eventTime && <Text style={styles.errorText}>{errors.eventTime.message}</Text>}
          </View>
        </View>

        <LocationPicker
          location={location}
          changeLocation={changeLocation}
        />

        <View style={styles.buttonContainer}>
          <Button title="Submit Report" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </ScrollView>
  )
}

export default ReportForm