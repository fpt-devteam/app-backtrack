// import { privateClient } from "@/src/api/common/client";
// import { API_ITEM_PREFIX } from "../constant/item.constant";
// import { ItemCreateRequest, ItemCreateResponse, ItemGetByIdRequest, ItemGetByIdResponse, ItemsPageRequest, ItemsPageResponse, } from "../types/item.type";

// export async function createItemAsync(request: ItemCreateRequest) {
//   const response = await privateClient.post(API_ITEM_PREFIX, request);
//   const result = response.data as ItemCreateResponse;
//   if (!result.success) return null;
//   return result.data;
// }

// export async function fetchItemByIdAsync(request: ItemGetByIdRequest) {
//   const response = await privateClient.get(`${API_ITEM_PREFIX}/${request.itemId}`);
//   const result = response.data as ItemGetByIdResponse;
//   if (!result.success) return null;
//   return result.data;
// }

// export async function fetchItemsAsync(request: ItemsPageRequest) {
//   const response = await privateClient.get(`${API_ITEM_PREFIX}`, { params: request });
//   const result = response.data as ItemsPageResponse;
//   if (!result.success) return null;
//   return result.data;
// }

import { privateClient } from "@/src/api/common/client";

import { ItemCreateRequest, ItemCreateResponse, ItemGetByIdRequest, ItemGetByIdResponse, ItemsPageRequest, ItemsPageResponse } from "../types/item.type";
// Bạn có thể sửa trực tiếp trong file constant hoặc ghi đè tại đây
const CORRECT_API_PREFIX = "/qr/qr-codes";

export async function createItemAsync(request: ItemCreateRequest) {
  // Postman cho thấy payload cần bọc trong object { item: request }
  const response = await privateClient.post(CORRECT_API_PREFIX, {
    item: request
  });
  const result = response.data as ItemCreateResponse;
  if (!result.success) return null;
  return result.data; // Trả về { qrCode, item }
}

export async function fetchItemByIdAsync(request: ItemGetByIdRequest) {
  // Sửa đường dẫn từ /items sang /qr-codes để khớp Postman
  const response = await privateClient.get(`${CORRECT_API_PREFIX}/${request.itemId}`);
  const result = response.data as ItemGetByIdResponse;
  if (!result.success) return null;
  
  // Dữ liệu trả về sẽ gồm: { qrCode: {...}, item: {...} }
  return result.data; 
}

export async function fetchItemsAsync(request: ItemsPageRequest) {
  // Sửa prefix để tránh lỗi 404
  const response = await privateClient.get(`${CORRECT_API_PREFIX}`, { 
    params: request 
  });
  const result = response.data as ItemsPageResponse;
  if (!result.success) return null;
  return result.data;
}