import { ImageField } from "@/src/shared/components";
import { useUploadImage } from "@/src/shared/hooks/useUploadImage";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as yup from "yup";
import useLinkQrItem from "../../hooks/useLinkQrItem";
import { ItemCreateRequest } from "../../types/item.type";
import { styles } from "./styles";

/* =======================
   Validation Schema
======================= */
const qrSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  images: yup
    .array()
    .of(
      yup
        .mixed<ImagePickerAsset>()
        .defined()
        .test("has-uri", "Invalid image (missing uri).", (asset) => {
          return !!asset && typeof asset === "object" && !!asset.uri;
        })
        .test("mime", "Only JPG/PNG/WebP images are allowed.", (asset) => {
          if (!asset?.mimeType) return true;
          return ["image/jpeg", "image/png", "image/webp"].includes(asset.mimeType);
        })
        .test("size", "Image is too large (max 5 MB).", (asset) => {
          if (!asset?.fileSize) return true;
          return asset.fileSize <= 5 * 1024 * 1024;
        })
    )
    .min(1, "Please select at least 1 image.")
    .max(5, "You can select up to 5 images.")
    .required("Images are required."),
}).required();

type ItemSchema = yup.InferType<typeof qrSchema>;

const ItemLinkForm = () => {
  const { uploadImages } = useUploadImage();
  const { linkItemToQr } = useLinkQrItem();

  const { control, handleSubmit, formState: { errors } } =
    useForm<ItemSchema>({
      defaultValues: {
        name: "",
        description: "",
        images: [],
      },
      resolver: yupResolver(qrSchema),
      mode: "onSubmit",
    });

  const handleUploadImages = async (images: ImagePickerAsset[]) => {
    const uploadRes = await uploadImages(images);
    if (!uploadRes) return [];
    return uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
  };

  /* =======================
     Submit Handler (FIXED)
  ======================= */
  const onSubmit: SubmitHandler<ItemSchema> = async (data) => {
    try {
      const imageUrls = await handleUploadImages(data.images);
      if (!imageUrls.length) {
        Alert.alert("Error", "Failed to upload images.");
        return;
      }

      const payload: ItemCreateRequest = {
        name: data.name,
        description: data.description,
        imageUrls,
      };

      const response = await linkItemToQr(payload);

      if (response?.qrCode?.id) {
        router.push(`/(protected)/(qr)/${response.qrCode.id}`);
      } else {
        Alert.alert("Error", "Failed to link item to QR code.");
      }

    } catch (err: any) {
      console.error("Link item to QR failed:", err);
      const status = err?.response?.status;

      if (status === 401) {
        Alert.alert("Unauthorized", "Your session has expired. Please log in again.");
      } else if (status === 404) {
        Alert.alert("Not Found", "API endpoint not found.");
      } else {
        Alert.alert("Error", err?.message || "Unexpected error occurred.");
      }
    }
  };

  /* =======================
     UI – GIỮ NGUYÊN
  ======================= */
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Item Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        {/* Photos */}
        <View style={styles.fieldContainer}>
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <ImageField value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.images && <Text style={styles.errorText}>{errors.images.message}</Text>}
        </View>

        {/* Item Name */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={20}
              color="#00b4d8"
              style={styles.labelIcon}
            />
            <Text style={styles.label}>Item Name</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                placeholder="e.g., Blue Samsonite Suitcase"
                placeholderTextColor="#9ca3af"
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Ionicons
              name="star-outline"
              size={20}
              color="#00b4d8"
              style={styles.labelIcon}
            />
            <Text style={styles.label}>Description</Text>
          </View>

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Scratches on the back, sticker on lid..."
                placeholderTextColor="#9ca3af"
                multiline
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>

        {/* Fee Box */}
        <View style={styles.feeContainer}>
          <View style={styles.feeIconCircle}>
            <Ionicons name="card-outline" size={20} color="#00b4d8" />
          </View>
          <View style={styles.feeTextContainer}>
            <Text style={styles.feeTitle}>Activation Fee</Text>
            <Text style={styles.feeSubtitle}>
              One-time payment for lifetime protection
            </Text>
          </View>
          <Text style={styles.feeAmount}>$0.99</Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
          <Text style={styles.submitButtonText}>Create</Text>
        </TouchableOpacity>

        {/* Secure Footer */}
        <View style={styles.secureFooter}>
          <Ionicons name="lock-closed" size={14} color="#94a3b8" />
          <Text style={styles.secureText}>
            Secure 256-bit SSL Encrypted Payment
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ItemLinkForm;
