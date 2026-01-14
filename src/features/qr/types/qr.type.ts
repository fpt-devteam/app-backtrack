export type QrCodeEntity = {
  id: string;
  publicCode: string;
  linkedAt: string;
  createdAt: string;
};

export type QrItemEntity = {
  name: string;
  description: string;
  imageUrls: string[];
};

export type QrOwnerEntity = {
  id: string;
  email: string;
  displayName?: string | null;
};

export type QrCodeData = {
  qrCode: QrCodeEntity;
  item: QrItemEntity;
  ownerId: string;
  owner?: QrOwnerEntity;
};
