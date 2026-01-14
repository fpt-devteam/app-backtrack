import { AppHeader } from '@/src/shared/components';
import { DefaultTopRightActionButton } from '@/src/shared/components/app-utils/AppHeader';
import { ImageField } from '@/src/shared/components/fields';
import { toast } from '@/src/shared/components/ui/toast';
import colors from '@/src/shared/theme/colors';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ImagePickerAsset } from 'expo-image-picker';
import { BookmarkIcon, SparkleIcon } from 'phosphor-react-native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';


const qrCodeProfileSchema = yup
  .object({
    name: yup
      .string()
      .required('Item name is required')
      .min(1, 'Item name cannot be empty')
      .max(100, 'Item name is too long (max 100 characters)'),
    description: yup
      .string()
      .max(500, 'Description is too long (max 500 characters)')
      .default('')
      .defined(),
    images: yup
      .array()
      .of(
        yup
          .mixed<ImagePickerAsset>()
          .defined()
          .test('has-uri', 'Invalid image (missing uri).', (asset) => {
            return !!asset && typeof asset === 'object' && !!asset.uri;
          })
          .test('mime', 'Only JPG/PNG/WebP/Heic images are allowed.', (asset) => {
            if (!asset) return true;

            const mime = asset.mimeType;
            if (!mime) return true;

            const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
            return allowedMimes.includes(mime);
          })
          .test('size', 'Image is too large (max 5 MB).', (asset) => {
            if (!asset) return true;

            const size = asset.fileSize;
            if (typeof size !== 'number') return true;

            const maxImageSize = 5 * 1024 * 1024; // 5 MB
            return size <= maxImageSize;
          })
      )
      .min(1, 'Please select at least 1 image.')
      .max(5, 'You can select up to 5 images.')
      .required('Images are required.'),
  })
  .required();

type QRCodeProfileFormSchema = yup.InferType<typeof qrCodeProfileSchema>;
type FormMode = "create" | "update";

const headerTitleMap: Record<FormMode, string> = {
  create: "Create Item Profile",
  update: "Edit Item Profile",
};

type QRCodeProfileFormProps = {
  mode: FormMode;
  initialValues?: Partial<QRCodeProfileFormSchema>;
  onSubmit: (data: QRCodeProfileFormSchema) => void | Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
};

const QRCodeProfileForm = ({ mode, initialValues, onSubmit, isSubmitting = false, submitButtonText = 'Save' }: QRCodeProfileFormProps) => {
  const { control, handleSubmit, formState: { errors, isValid }, watch, reset, } = useForm<QRCodeProfileFormSchema>({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      ...initialValues,
    },
    resolver: yupResolver(qrCodeProfileSchema),
    mode: 'onChange',
  });
  const nameValue = watch('name');
  const descriptionValue = watch('description');

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!initialValues) return;
    reset({
      name: "",
      description: "",
      images: [],
      ...initialValues,
    });
  }, [initialValues, reset]);

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <AppHeader
        title={headerTitleMap[mode]}
        rightActionButton={
          <DefaultTopRightActionButton
            lable={submitButtonText}
            onPress={handleSubmit(
              onSubmit,
              (errs) => {
                console.log(errs);
                toast.error("Form invalid", errs.description?.message || errs.name?.message || "please check required fields");
              }
            )}
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
          />
        } />

      <KeyboardAwareScrollView
        className='p-4'
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={10}
        extraHeight={150}
        keyboardOpeningTime={0}
      >
        {/* Image Upload Section */}
        <View className="mb-6">
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange, value } }) => (
              <ImageField value={value} onChange={onChange} />
            )}
          />

          {!!errors.images && (
            <Text className="text-red-500 text-xs mt-1 ml-1">
              {(() => {
                const err = errors.images as any;

                // lỗi cấp mảng: min/max/required
                if (typeof err?.message === "string") return err.message;

                // lỗi từng item: errors.images[index].message
                if (Array.isArray(err)) {
                  const firstMsg = err.find((e) => typeof e?.message === "string")?.message;
                  return firstMsg ?? "Invalid image.";
                }

                return "Invalid image.";
              })()}
            </Text>
          )}
        </View>


        {errors.images && (
          <Text className="text-red-500 text-xs mt-1 ml-1">
            {errors.images.message}
          </Text>
        )}

        {/* Item Name Field */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <BookmarkIcon size={20} color={colors.primary} weight="fill" />
            <Text className="ml-2 text-base font-semibold text-gray-900">
              Item Name
            </Text>
          </View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g., Blue Samsonite Suitcase"
                placeholderTextColor={colors.slate[400]}
                className="bg-gray-50 rounded-2xl px-4 py-3 text-base text-gray-900"
                style={{
                  borderWidth: 1,
                  borderColor: errors.name ? colors.red[500] : colors.slate[200],
                }}
                maxLength={100}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.name ? (
            <Text className="text-red-500 text-xs mt-1 ml-1">
              {errors.name.message}
            </Text>
          ) : (
            nameValue && nameValue.length > 0 && (
              <Text className="text-xs text-gray-400 mt-1 ml-1">
                {nameValue.length}/100 characters
              </Text>
            )
          )}
        </View>

        {/* Description Field */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <SparkleIcon size={20} color={colors.primary} weight="fill" />
            <Text className="ml-2 text-base font-semibold text-gray-900">
              Note
            </Text>
          </View>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Scratches on the back, sticker on lid..."
                placeholderTextColor={colors.slate[400]}
                multiline
                numberOfLines={15}
                textAlignVertical="top"
                className="bg-gray-50 rounded-2xl px-4 py-3 text-base text-gray-900"
                style={{
                  borderWidth: 1,
                  borderColor: errors.description ? colors.red[500] : colors.slate[200],
                  minHeight: 120,
                }}
                maxLength={700}
                editable={!isSubmitting}
              />
            )}
          />
          {errors.description ? (
            <Text className="text-red-500 text-xs mt-1 ml-1">
              {errors.description.message}
            </Text>
          ) : (
            descriptionValue && descriptionValue.length > 0 && (
              <Text className="text-xs text-gray-400 mt-1 ml-1">
                {descriptionValue.length}/700 characters
              </Text>
            )
          )}
        </View>

      </KeyboardAwareScrollView>
    </View>
  );
};

export default QRCodeProfileForm;
export type { QRCodeProfileFormSchema };

