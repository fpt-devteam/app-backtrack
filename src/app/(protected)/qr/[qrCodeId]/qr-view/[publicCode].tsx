import { QRCodeView } from '@/src/features/qr/components';
import { useLocalSearchParams, router } from 'expo-router';
import React from 'react';

const QRCodeViewScreen = () => {
  const { publicCode } = useLocalSearchParams<{ publicCode: string }>();

  const handleBack = () => {
    router.back();
  };

  return (
    <QRCodeView
      publicCode={publicCode || ''}
      onBack={handleBack}
    />
  );
};

export default QRCodeViewScreen;
