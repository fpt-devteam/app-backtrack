import { ApiResponse, Nullable } from "../../../shared/types/global.type";

export type Item = {
  id: string,
  name: string,
  description: string,
  imageUrls: string[],
  ownerId: string,
  qrCode: QrCode,
  createdAt: Nullable<string>,
  updatedAt: Nullable<string>,
};

export type ItemCardProps = Omit<Item, "qrCode">;

export type QrCode = {
  id: string,
  publicCode: string,
  status: string,
  ownerId: string,
  itemId: string,
  linkedAt: Nullable<string>,
  createdAt: Nullable<string>,
};

export type ItemCreateRequest = {
  name: string,
  description: string,
  imageUrls: string[],
};

export type ItemCreateResponse = ApiResponse<QrLinkedItem>;

export type QrLinkedItem = Item & { qrCode: QrCode };

export type ItemGetByIdRequest = {
  itemId: string,
};

export type ItemGetByIdResponse = ApiResponse<Item>;

export type ItemsPageRequest = {
  page: number,
  pageSize: number,
};

export type ItemsPage = {
  items: Item[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type ItemsPageResponse = {
  success: boolean;
  data: ItemsPage;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};