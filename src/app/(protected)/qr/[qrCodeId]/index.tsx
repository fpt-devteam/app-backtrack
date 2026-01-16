import { QRCodeDetail } from '@/src/features/qr/components';
import { useGetQRCodeById } from '@/src/features/qr/hooks';
import { AppInlineError, AppLoader } from '@/src/shared/components';
import { toast } from '@/src/shared/components/ui/toast';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const QRCodeDetailScreen = () => {
  const { qrCodeId } = useLocalSearchParams<{ qrCodeId: string }>();
  const { qrCode, isLoading, error } = useGetQRCodeById(qrCodeId || '');
  if (isLoading) {
    return (
      <AppLoader />
    );
  }

  if (error || !qrCode) {
    return (
      <AppInlineError message="Failed to load QR code details." />
    );
  }


  const handleDelete = () => {
    // TODO: Implement delete/move to trash functionality
    toast.info('Delete functionality', 'This feature is coming soon.');
  };

  return (
    <QRCodeDetail
      id={qrCode.qrCode.id}
      name={qrCode.item.name}
      description={qrCode.item.description}
      imageUrl={qrCode.item.imageUrls[0] || ''}
      publicCode={qrCode.qrCode.publicCode}
      isActive={true} // TODO: Add active status to API response
      lastUpdated={qrCode.qrCode.linkedAt || qrCode.qrCode.createdAt}
      onDelete={handleDelete}
    />
  );
};

export default QRCodeDetailScreen;
