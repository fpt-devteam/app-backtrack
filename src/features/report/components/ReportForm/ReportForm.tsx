import { GoogleMapDetailLocation } from "@/src/shared/types/location.type";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Alert, Button, FlatList, Pressable, Text, TextInput, View } from "react-native";
import * as yup from "yup";

import useCreateReport from "@/src/features/report/hooks/useCreateReport";
import { CreateReportRequest, ReportDetails } from "@/src/features/report/types/report.type";
import LocationPicker from "@/src/shared/components/LocationPicker/LocationPicker";
import { useUploadImage } from "@/src/shared/hooks/useUploadImage";
import { ImageAsset } from "@/src/shared/types/firebase.type";
import { Nullable } from "@/src/shared/types/global.type";
import ImagePickerSection from "../../../../shared/components/ImagePickerSection/ImagePickerSection";
import { styles } from "./styles";

const reportSchema = yup
  .object({
    postType: yup.string().required("Post type is required"),
    itemName: yup.string().required("Item name is required"),
    description: yup.string().required("Description is required"),
    eventTime: yup.date().required("Event time is required"),
    materials: yup.string().required().defined(),
    brands: yup.string().required().defined(),
    colors: yup.string().required().defined(),
  })
  .required();

type ReportFormSchema = yup.InferType<typeof reportSchema>;

const ReportForm = (initialData: Nullable<ReportDetails>) => {
  const [reportData, setReportData] = useState<Nullable<ReportDetails>>(initialData);

  const [images, setImages] = useState<ImageAsset[]>([]);
  const [location, setLocation] = useState<Nullable<GoogleMapDetailLocation>>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { uploadImages } = useUploadImage();
  const { createNewReport } = useCreateReport();

  const { control, handleSubmit, reset: resetForm, formState: { errors },
  } = useForm<ReportFormSchema>({
    defaultValues: {
      postType: reportData?.postType ?? "",
      itemName: reportData?.itemName ?? "",
      description: reportData?.description ?? "",
      materials: reportData?.materials?.join(", ") ?? "",
      brands: reportData?.brands?.join(", ") ?? "",
      colors: reportData?.colors?.join(", ") ?? "",
      eventTime: reportData?.eventTime ? new Date(reportData.eventTime) : new Date(),
    },
    resolver: yupResolver(reportSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    resetForm({
      postType: reportData?.postType ?? "",
      itemName: reportData?.itemName ?? "",
      description: reportData?.description ?? "",
      materials: reportData?.materials ? reportData?.materials.join(", ") : "",
      brands: reportData?.brands ? reportData?.brands.join(", ") : "",
      colors: reportData?.colors ? reportData?.colors.join(", ") : "",
      eventTime: reportData?.eventTime ? new Date(reportData.eventTime) : new Date(),
    });
  }, [reportData]);

  const pickImages = useCallback((newImages: ImageAsset[]) => {
    setImages((prev) => {
      const map = new Map<string, ImageAsset>();
      for (const img of prev) map.set(img.uri, img);
      for (const img of newImages) map.set(img.uri, img);
      return Array.from(map.values());
    });
  }, []);

  const changeLocation = useCallback((newLocation: Nullable<GoogleMapDetailLocation>) => {
    setLocation(newLocation);
    console.log("Location changed: ", newLocation);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (images.length === 0) {
      Alert.alert("Validation Error", "Please pick at least one image.");
      return false;
    }
    if (!location) {
      Alert.alert("Validation Error", "Please select a location.");
      return false;
    }
    return true;
  }, [images.length, location]);

  const handleUploadImages = useCallback(async (): Promise<string[]> => {
    const uploadRes = await uploadImages(images);

    if (!uploadRes) {
      return [];
    }

    const imageUrls = uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
    return imageUrls;
  }, [images, uploadImages]);

  const onSubmit: SubmitHandler<ReportFormSchema> = async (data: ReportFormSchema) => {
    const isFormValid = validateForm();
    if (!isFormValid) return;

    try {
      const imageUrls = await handleUploadImages();
      if (imageUrls.length === 0) {
        Alert.alert("Error", "Failed to upload images.");
        return;
      }

      const materialsArray = data.materials ? data.materials.split(",").map((s) => s.trim()).filter(Boolean) : null;
      const brandsArray = data.brands ? data.brands.split(",").map((s) => s.trim()).filter(Boolean) : null;
      const colorsArray = data.colors ? data.colors.split(",").map((s) => s.trim()).filter(Boolean) : null;

      const reportData: CreateReportRequest = {
        postType: data.postType,
        itemName: data.itemName,
        description: data.description,
        materials: materialsArray,
        brands: brandsArray,
        colors: colorsArray,
        imageUrls,
        location: location?.location!,
        externalPlaceId: location?.externalPlaceId || null,
        displayAddress: location?.displayAddress || null,
        eventTime: data.eventTime || new Date(),
      };

      console.log("Report data to submit:", reportData);
      const reportDetails = await createNewReport(reportData);
      setReportData(reportDetails);
      Alert.alert("Success", "Report submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  const content = useMemo(
    () => (
      <View style={styles.container}>
        <ImagePickerSection images={images} pickImages={pickImages} />

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Item Details</Text>

          {/* Post Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Post Type*</Text>
            <Controller
              control={control}
              name="postType"
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioGroup}>
                  <Button
                    title="Lost"
                    onPress={() => onChange("Lost")}
                    color={value === "Lost" ? "#007AFF" : "#8E8E93"}
                  />
                  <View style={{ width: 12 }} />
                  <Button
                    title="Found"
                    onPress={() => onChange("Found")}
                    color={value === "Found" ? "#007AFF" : "#8E8E93"}
                  />
                </View>
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
            <Text style={styles.label}>Description*</Text>
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

          {/* Materials */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Materials</Text>
            <Controller
              control={control}
              name="materials"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Leather, Cotton (comma-separated)"
                  value={value ?? ""}
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
                  placeholder="e.g. Nike, Apple (comma-separated)"
                  value={value ?? ""}
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
                  placeholder="e.g. Blue, Red (comma-separated)"
                  value={value ?? ""}
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
              render={({ field: { onChange, value } }) => {
                const formatDateTime = (date: Date) => {
                  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) {
                    return 'Select date and time';
                  }
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const hours = String(date.getHours()).padStart(2, '0');
                  const minutes = String(date.getMinutes()).padStart(2, '0');
                  return `${year}-${month}-${day} : ${hours}:${minutes}`;
                };

                return (
                  <>
                    <Pressable
                      style={[styles.input, errors.eventTime && styles.inputError]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={{ color: value ? '#000' : '#999' }}>
                        {formatDateTime(value)}
                      </Text>
                    </Pressable>

                    {showDatePicker && (
                      <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (event.type === 'set' && selectedDate) {
                            // Preserve time from current value
                            const currentTime = value || new Date();
                            const newDate = new Date(selectedDate);
                            newDate.setHours(currentTime.getHours());
                            newDate.setMinutes(currentTime.getMinutes());
                            newDate.setSeconds(0);
                            newDate.setMilliseconds(0);
                            onChange(newDate);
                            // Show time picker after date is selected
                            setTimeout(() => setShowTimePicker(true), 100);
                          }
                        }}
                      />
                    )}

                    {showTimePicker && (
                      <DateTimePicker
                        value={value || new Date()}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                          setShowTimePicker(false);
                          if (event.type === 'set' && selectedTime) {
                            // Preserve date from current value
                            const currentDate = value || new Date();
                            const newDateTime = new Date(currentDate);
                            newDateTime.setHours(selectedTime.getHours());
                            newDateTime.setMinutes(selectedTime.getMinutes());
                            newDateTime.setSeconds(0);
                            newDateTime.setMilliseconds(0);
                            onChange(newDateTime);
                          }
                        }}
                      />
                    )}
                  </>
                );
              }}
            />
            {errors.eventTime && <Text style={styles.errorText}>{errors.eventTime.message}</Text>}
          </View>
        </View>

        <LocationPicker location={location} changeLocation={changeLocation} />

        <View style={styles.buttonContainer}>
          <Button title="Submit Report" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    ),
    [images, pickImages, control, errors, location, changeLocation, handleSubmit, showDatePicker, showTimePicker]
  );

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
  );
};

export default ReportForm;
