import { QRCodeView } from '@/src/features/qr/components';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const QRCodeViewScreen = () => {
  const { publicCode } = useLocalSearchParams<{ publicCode: string }>();

  return (
    <QRCodeView
      publicCode={publicCode || ''}
    />
  );
};

export default QRCodeViewScreen;
