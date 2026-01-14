import { QRCodeProfileForm, QRCodeProfileFormSchema } from '@/src/features/qr/components';
import { useGetQRCodeById, useUpdateQRCode } from '@/src/features/qr/hooks';
import { UpdateQrCodeRequest } from '@/src/features/qr/types';
import { AppInlineError, AppLoader } from '@/src/shared/components';
import { toast } from '@/src/shared/components/ui/toast';
import { useUploadImage } from '@/src/shared/hooks';
import { getErrorMessage2 } from '@/src/shared/utils';
import { ImagePickerAsset } from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';

const EditQRScreen = () => {
  const { qrCodeId } = useLocalSearchParams<{ qrCodeId: string }>();
  const { qrCode, isLoading: isLoadingQR } = useGetQRCodeById(qrCodeId || '');
  const { uploadImages, isUploadingImages } = useUploadImage();

  const { updateQRCode, isLoading: isUpdating } = useUpdateQRCode({
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success('QR Code updated!', 'Your changes have been saved.');
        router.back();
      }
    },
    onError: (error) => {
      toast.info(
        'Update failed',
        getErrorMessage2(error)
      );
    },
  });

  const initialValues = useMemo(() => {
    if (!qrCode) return undefined;

    const imageAssets: ImagePickerAsset[] = qrCode.item.imageUrls.map((url, index) => ({
      uri: url,
      width: 0,
      height: 0,
      assetId: `existing-${index}`,
      fileName: `image-${index}`,
      mimeType: 'image/jpeg',
    }));

    return {
      name: qrCode.item.name,
      description: qrCode.item.description,
      images: imageAssets,
    };
  }, [qrCode]);

  const handleFormSubmit = async (data: QRCodeProfileFormSchema) => {
    if (!qrCodeId) return;

    try {
      const hasNewImages = data.images.some((img) => !img.uri.startsWith('http'));

      let imageUrls: string[];

      if (hasNewImages) {
        const uploadRes = await uploadImages(data.images);
        if (!uploadRes || uploadRes.length === 0) {
          toast.error('Upload failed', 'Failed to upload images.');
          return;
        }
        imageUrls = uploadRes.map((res: { downloadURL: string }) => res.downloadURL);
      } else {
        imageUrls = data.images.map((img) => img.uri);
      }

      await updateQRCode({
        id: qrCodeId,
        data: {
          name: data.name,
          description: data.description,
          imageUrls,
        } as UpdateQrCodeRequest,
      });
    } catch (error) {
      toast.error('Update failed', getErrorMessage2(error));
    }
  };

  if (isLoadingQR) {
    return <AppLoader />;
  }

  if (!qrCode) {
    return <AppInlineError message="QR Code not found." />;
  }

  return (
    <QRCodeProfileForm
      mode="update"
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      isSubmitting={isUpdating || isUploadingImages}
    />
  );
};

export default EditQRScreen;
