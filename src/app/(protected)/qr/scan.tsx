import { useAppUser } from '@/src/features/auth/providers/user.provider';
import { QRCodeProfileForm, QRCodeProfileFormSchema } from '@/src/features/qr/components';
import { useCreateQRCode } from '@/src/features/qr/hooks';
import { CreateQrCodeRequest } from '@/src/features/qr/types';
import { toast } from '@/src/shared/components/ui/toast';
import { QR_ROUTE } from '@/src/shared/constants';
import { router } from "expo-router";
import React, { useMemo } from 'react';

const GenerateQRScreen = () => {
  const { user } = useAppUser();

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

  const buildInitialDescription = React.useCallback((): string => {
    if (!user) return '';

    const ownerName = user.displayName || 'Owner';
    const ownerContact = user.email || 'No contact provided';

    return `Thank you for finding this item! This belongs to ${ownerName}.

Owner Contact: ${ownerContact}

If you found this item, please contact the owner. Your kindness and help in returning this item would be greatly appreciated!`;
  }, [user]);

  const initializeFormData = useMemo((): QRCodeProfileFormSchema => {
    return {
      name: '',
      description: buildInitialDescription(),
      images: [],
    };
  }, [buildInitialDescription]);

  return (
    <QRCodeProfileForm
      mode="create"
      onSubmit={handleFormSubmit}
      isSubmitting={isLoading}
      initialValues={initializeFormData}
    />
  );
};

export default GenerateQRScreen;
