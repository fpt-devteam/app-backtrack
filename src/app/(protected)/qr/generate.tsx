import { QRCodeProfileForm, QRCodeProfileFormSchema } from '@/src/features/qr/components';
import { useCreateQRCode } from '@/src/features/qr/hooks';
import { CreateQrCodeRequest } from '@/src/features/qr/types';
import { toast } from '@/src/shared/components/ui/toast';
import { QR_ROUTE } from '@/src/shared/constants';
import { router } from "expo-router";
import React from 'react';

const GenerateQRScreen = () => {
  const { createQRCode, isLoading } = useCreateQRCode({
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success('QR Code created!', 'Your digital QR code is ready to use.');
        router.replace(QR_ROUTE.index);
      }
    },
    onError: (error) => {
      toast.error(
        'Creation failed',
        error.message || 'Failed to create QR code. Please try again.'
      );
    },
  });

  const handleFormSubmit = async (data: QRCodeProfileFormSchema) => {
    await createQRCode({
      item: {
        name: data.name,
        description: data.description,
        imageUrls: data.images.map((img) => img.uri),
      }
    } as CreateQrCodeRequest);
  }

  return (
    <QRCodeProfileForm
      mode="create"
      onSubmit={handleFormSubmit}
      isSubmitting={isLoading}
      submitButtonText="Create"
    />
  );
};

export default GenerateQRScreen;
